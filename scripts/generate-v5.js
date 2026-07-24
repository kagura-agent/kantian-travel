/**
 * 看天出发 — 方案生成引擎 v5
 * 
 * 改进：
 *   - POI 搜索时带评分过滤（rating >= 3.5）
 *   - 过滤掉非旅游类型（商住楼、建材市场等）
 *   - 模型只输出 place_name，我们查坐标
 *   - prompt 带交通成本（自驾+公交）
 *   - prompt 硬约束用餐时间（午餐11:30-13:00，晚餐17:30-19:00）
 *   - 生成后校验路线顺序（用坐标检测回头路）
 * 
 * 用法：
 *   AMAP_KEY=*** LLM_TOKEN=*** node scripts/generate-v5.js --location 苏州工业园区 --tag 周六
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const amap = require('../services/amap');

// LLM Config
const LLM_BASE = 'floway.sg.kagura-agent.com';
const LLM_TOKEN = process.env.LLM_TOKEN || '';
const LLM_MODEL = 'gpt-5.6-sol';

function callLLM(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: LLM_MODEL,
      max_tokens: 16384,
      messages: [{ role: 'user', content: prompt }]
    });
    const options = {
      hostname: LLM_BASE,
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': LLM_TOKEN,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const textBlock = json.content?.find(b => b.type === 'text');
          const text = textBlock?.text || json.choices?.[0]?.message?.content || '';
          resolve(text);
        } catch(e) { reject(new Error('LLM parse error: ' + data.slice(0, 200))); }
      });
    });
    req.on('error', reject);
    req.setTimeout(120000, () => { req.destroy(); reject(new Error('LLM timeout')); });
    req.write(body);
    req.end();
  });
}

// === Config ===
const CACHE_DIR = path.join(__dirname, '..', 'cache');
const GENERATED_DIR = path.join(__dirname, '..', 'generated');
const QUALITY_DIR = path.join(__dirname, '..', 'quality');

const POI_CACHE_TTL = 30 * 24 * 3600 * 1000;
const ROUTE_CACHE_TTL = 7 * 24 * 3600 * 1000;

const TAG_CONFIG = {
  '周六': { radius: 150000, maxDrive: 150, days: 1 },
  '周日': { radius: 150000, maxDrive: 150, days: 1 },
  '周末两天': { radius: 200000, maxDrive: 180, days: 2 },
};

// 绝对排除的 POI 类型
const EXCLUDED_TYPES = [
  '汽车服务', '汽车销售', '公司企业', '工厂', '产业园',
  '物流', '政府机构', '保险', '中小学校', '培训机构',
  '殡葬', '加油站', '停车场', '公厕', '储藏室',
  '建材市场', '家居建材'
];

// === CLI Args ===
const args = {};
process.argv.slice(2).forEach((arg, i, arr) => {
  if (arg.startsWith('--')) args[arg.slice(2)] = arr[i + 1];
});

const LOCATION = args.location || '苏州工业园区';
const TAG = args.tag || '周六';

const DISTRICT_CENTERS = {
  '苏州工业园区': { lat: 31.295, lng: 120.720 },
  '苏州吴江区': { lat: 31.160, lng: 120.645 },
  '苏州姑苏区': { lat: 31.310, lng: 120.620 },
};

// === Cache ===
function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function cacheGet(type, key) {
  const file = path.join(CACHE_DIR, type, `${key}.json`);
  if (!fs.existsSync(file)) return null;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const ttl = type === 'routes' ? ROUTE_CACHE_TTL : POI_CACHE_TTL;
  if (Date.now() - data._cachedAt > ttl) return null;
  return data;
}
function cacheSet(type, key, data) {
  ensureDir(path.join(CACHE_DIR, type));
  fs.writeFileSync(path.join(CACHE_DIR, type, `${key}.json`), JSON.stringify({ ...data, _cachedAt: Date.now() }, null, 2));
}

// === Date Range ===
function getDateRange(tag) {
  const today = new Date();
  const fmt = d => d.toISOString().split('T')[0];
  const weekday = d => ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
  switch (tag) {
    case '周六': {
      const d = new Date(today);
      d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
      return [{ date: fmt(d), weekday: '周六' }];
    }
    case '周日': {
      const d = new Date(today);
      d.setDate(d.getDate() + ((7 - d.getDay()) % 7 || 7));
      return [{ date: fmt(d), weekday: '周日' }];
    }
    case '周末两天': {
      const sat = new Date(today);
      sat.setDate(sat.getDate() + ((6 - sat.getDay() + 7) % 7 || 7));
      const sun = new Date(sat); sun.setDate(sun.getDate() + 1);
      return [{ date: fmt(sat), weekday: '周六' }, { date: fmt(sun), weekday: '周日' }];
    }
    default: return [{ date: fmt(new Date(today.getTime() + 86400000)), weekday: '明天' }];
  }
}

// === POI 质量过滤 ===
function isGoodPOI(poi) {
  const type = poi.type || '';
  // 绝对排除的类型
  for (const excluded of EXCLUDED_TYPES) {
    if (type.includes(excluded)) return false;
  }
  // 有评分但太低的排除
  if (poi.rating && parseFloat(poi.rating) > 0 && parseFloat(poi.rating) < 3.0) return false;
  // 商场/购物类：需要有活跃信号（评分或照片或营业时间），没有的可能已倒闭
  if (type.includes('购物') || type.includes('商场') || type.includes('商务住宅')) {
    const hasRating = poi.rating && parseFloat(poi.rating) > 0;
    const hasPhotos = poi.photos && poi.photos.length > 0;
    const hasOpenTime = poi.opentime;
    if (!hasRating && !hasPhotos && !hasOpenTime) return false;
  }
  return true;
}

// === 路线顺序校验（检测回头路）===
function checkRouteOrder(steps) {
  const coords = steps
    .filter(s => s._coords)
    .map(s => ({ lat: s._coords.lat, lng: s._coords.lng, name: s.place_name }));
  if (coords.length < 3) return { ok: true };

  // 计算总距离 vs 顺序距离
  let totalDist = 0;
  for (let i = 1; i < coords.length; i++) {
    totalDist += Math.abs(coords[i].lat - coords[i-1].lat) + Math.abs(coords[i].lng - coords[i-1].lng);
  }
  // 如果来回跑，总距离会远大于起点到终点的直线距离
  const directDist = Math.abs(coords[coords.length-1].lat - coords[0].lat) + Math.abs(coords[coords.length-1].lng - coords[0].lng);
  const ratio = totalDist / (directDist || 0.001);
  return { ok: ratio < 3, ratio: ratio.toFixed(1) };
}

// === Main ===
async function main() {
  amap.setKey(process.env.AMAP_KEY);
  if (!process.env.AMAP_KEY) { console.error('Missing AMAP_KEY'); process.exit(1); }
  if (!LLM_TOKEN) { console.error('Missing LLM_TOKEN'); process.exit(1); }

  const userLocation = DISTRICT_CENTERS[LOCATION];
  if (!userLocation) { console.error(`Unknown location: ${LOCATION}`); process.exit(1); }

  const tagConfig = TAG_CONFIG[TAG] || TAG_CONFIG['周六'];
  const dateRange = getDateRange(TAG);

  console.log(`\n🌤️  看天出发 v5`);
  console.log(`   位置: ${LOCATION} | Tag: ${TAG} (${dateRange.map(d => d.date + ' ' + d.weekday).join(' + ')})`);
  console.log(`   半径: ${tagConfig.radius/1000}km | 最大车程: ${tagConfig.maxDrive}min\n`);

  // === 天气 ===
  console.log('🌡️ 天气...');
  const adcodeMap = { '苏州': '320500', '上海': '310000', '杭州': '330100' };
  const cityName = LOCATION.slice(0, 2);
  const weather = await amap.getWeather(adcodeMap[cityName] || '320500');
  weather.forecasts.forEach(f => console.log(`   ${f.date} 周${f.week}: ${f.dayWeather} ${f.dayTemp}°/${f.nightTemp}°`));

  // === Step 0: 搜索策略 ===
  console.log('\n🧠 搜索策略...');
  const strategyCacheKey = `${LOCATION}-${TAG}-strategy-v5`;
  let strategy = cacheGet('strategies', strategyCacheKey);

  if (!strategy) {
    const sp = `你是旅行搜索策略生成器。

用户：${LOCATION}，${TAG}（${tagConfig.days}天）
天气：${weather.forecasts.slice(0,2).map(f => f.date + ' ' + f.dayWeather + ' ' + f.dayTemp + '°').join(', ')}
最大车程：${tagConfig.maxDrive}分钟

输出搜索策略JSON（只输出JSON）：
{"nearby_types":["适合旅游的POI类型"],"keyword_searches":[{"keyword":"具体远途目的地","city":"所在城市"}],"transport":"driving","time_preference":"早出晚归","exclude":["不适合的类型"]}`;

    try {
      const so = await callLLM(sp);
      const ss = so.indexOf('{'), se = so.lastIndexOf('}') + 1;
      if (ss !== -1 && se > 0) {
        strategy = JSON.parse(so.slice(ss, se));
        cacheSet('strategies', strategyCacheKey, strategy);
        console.log(`   ✅ 近搜[${strategy.nearby_types?.slice(0,5).join(',')}] 远搜${strategy.keyword_searches?.length || 0}个`);
      }
    } catch(e) { console.log(`   ⚠️ 用默认策略`); }
  } else {
    console.log(`   缓存命中`);
  }
  if (!strategy) {
    strategy = { nearby_types: ['风景名胜','古镇','湖泊','森林公园'], keyword_searches: [], transport: 'driving' };
  }

  // === Step 1: POI 搜索 + 质量过滤 ===
  console.log('\n🔍 搜索+过滤...');
  const cacheKey = `${LOCATION}-r${tagConfig.radius}-${TAG}-v5`;
  let discoveredPois = cacheGet('discovery', cacheKey);

  if (!discoveredPois) {
    const allResults = [];

    // 近程搜索
    for (const type of (strategy.nearby_types || []).slice(0, 6)) {
      const results = await amap.searchNearby(userLocation, type, Math.min(tagConfig.radius, 50000));
      allResults.push(...results);
      await new Promise(r => setTimeout(r, 500));
    }

    // 远程关键词搜索
    if (strategy.keyword_searches) {
      for (const ks of strategy.keyword_searches.slice(0, 10)) {
        const results = await amap.searchPOI(ks.keyword, { city: ks.city, citylimit: true });
        for (const r of results.slice(0, 3)) {
          allResults.push({ ...r, distance: 999999, location: r.location });
        }
        await new Promise(r => setTimeout(r, 500));
      }
    }

    // 去重 + 质量过滤
    const seen = new Set();
    discoveredPois = allResults.filter(p => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return isGoodPOI(p);
    }).map(p => ({
      id: p.id, name: p.name, type: p.type,
      lat: p.location.lat, lng: p.location.lng,
      distance: p.distance,
      rating: p.rating || null
    }));

    cacheSet('discovery', cacheKey, { pois: discoveredPois });
    const filtered = allResults.length - discoveredPois.length;
    console.log(`   发现 ${allResults.length} → 过滤后 ${discoveredPois.length}（过滤了 ${filtered} 个低质量/非旅游点）`);
  } else {
    discoveredPois = discoveredPois.pois;
    console.log(`   缓存: ${discoveredPois.length} 个`);
  }

  // === Step 2: 路线（自驾+公交）===
  console.log('\n🚗 路线...');
  const poisWithRoutes = [];
  const sorted = [...discoveredPois].sort((a, b) => a.distance - b.distance);
  const near = sorted.filter(p => p.distance <= 30000).slice(0, 5);
  const mid = sorted.filter(p => p.distance > 30000 && p.distance <= 80000).slice(0, 8);
  const far = sorted.filter(p => p.distance > 80000).slice(0, 10);
  const toCalc = [...near, ...mid, ...far];

  for (const poi of toCalc) {
    const routeKey = `${LOCATION}-${poi.id}-v5`;
    let route = cacheGet('routes', routeKey);
    if (!route) {
      try {
        route = await amap.getRoute(userLocation, { lat: poi.lat, lng: poi.lng });
        const transit = await amap.getTransitRoute(userLocation, { lat: poi.lat, lng: poi.lng });
        if (transit) route.transit = transit;
        cacheSet('routes', routeKey, route);
      } catch(e) { continue; }
      await new Promise(r => setTimeout(r, 500));
    }
    if (route.duration <= tagConfig.maxDrive) {
      poisWithRoutes.push({ ...poi, route });
    }
  }
  console.log(`   ${poisWithRoutes.length} 个可达`);

  // === Step 3: 餐饮 ===
  console.log('\n🍜 餐饮...');
  const restaurants = [];
  for (const poi of poisWithRoutes.slice(0, 5)) {
    const food = await amap.searchNearby({ lat: poi.lat, lng: poi.lng }, '餐厅', 2000);
    for (const f of food.slice(0, 2)) {
      restaurants.push({ name: f.name, lat: f.location.lat, lng: f.location.lng, nearPoi: poi.name });
    }
    await new Promise(r => setTimeout(r, 500));
  }
  console.log(`   ${restaurants.length} 家`);

  // === Step 4: 组装 prompt ===
  console.log('\n✍️ Prompt...');

  const poiByName = {};
  poisWithRoutes.forEach(p => { poiByName[p.name] = { lat: p.lat, lng: p.lng }; });
  restaurants.forEach(r => { poiByName[r.name] = { lat: r.lat, lng: r.lng }; });

  let prompt = `=== 旅行方案生成 ===

用户：${LOCATION}
日期：${dateRange.map(d => d.date + ' ' + d.weekday).join(' + ')}（${tagConfig.days}天）

--- 天气 ---
`;
  for (const f of weather.forecasts) {
    prompt += `${f.date} 周${f.week}: ${f.dayWeather} ${f.dayTemp}°/${f.nightTemp}°\n`;
  }

  prompt += `\n--- 可达景点（含交通成本）---\n`;
  for (const p of poisWithRoutes) {
    let line = `${p.name}`;
    if (p.rating) line += `（评分${p.rating}）`;
    line += ` | 自驾 ${p.route.distance}km ${p.route.durationText}`;
    if (p.route.tollDistance > 0) line += ` 过路费约${Math.round(p.route.tollDistance * 0.5)}元`;
    if (p.route.transit) {
      line += ` | 公交 ${p.route.transit.durationText} 约${p.route.transit.cost}元 步行${p.route.transit.walking}km`;
    }
    prompt += line + '\n';
  }

  prompt += `\n--- 周边餐饮 ---\n`;
  for (const r of restaurants) {
    prompt += `${r.name} | 靠近${r.nearPoi}\n`;
  }

  prompt += `
=== 生成要求 ===
生成 5-8 个方案（如果是多天行程则生成 3-5 个）。严格要求：

【体验多样性】方案必须覆盖不同体验风格，给不同性格的用户选择：
  - 至少1个户外自然类（山/湖/竹海/花海，高温天安排在早晨6-9点或傍晚17点后）
  - 至少1个文化室内类（博物馆/美术馆/展览）
  - 至少1个水乡古镇类（廊棚遮阳，高温天也能走）
  - 至少1个休闲体验类（美食/咖啡/手作/亲子）
  - 可以有户外冒险类（漂流/徒步/骑行，安排在凉爽时段）
【距离多样性】近郊+中途+远途都要有，不能全在同一片区域
【用餐时间】午餐 11:30-13:00，晚餐 17:30-19:00，不要在其他时间吃正餐
【路线顺路】多个景点按地理位置顺序排列，不走回头路
【天气智能适配】高温天不是"全推室内"，而是：
  - 户外安排在早晨(6-9点)或傍晚(17点后)
  - 有遮阴/水边/山林等自然降温条件的地方，高温天也值得去
  - 午后11-16点安排室内或有遮阴的场所
  - reason 里要说清为什么这个天气适合去这个地方
【真实交通】使用上面给出的真实车程时间
【地点名称】place_name 必须用列表中出现过的名字，出发/到家为 null

只输出纯 JSON 数组，不要 markdown 包裹：
[{
  "title": "...", "location": "${LOCATION}", "tag": "${TAG}",
  "valid_date": ${dateRange.length > 1 ? '["' + dateRange.map(d => d.date).join('","') + '"]' : '"' + dateRange[0].date + '"'},
  "reason": "...",
  "weather": { "desc": "...", "high": N, "low": N },
  "days": [{
    "day_index": 0, "activity": "...",
    "weather": { "desc": "...", "high": N, "low": N },
    "steps": [{
      "step_index": 0, "type": "depart/transit/play/eat/stay/home",
      "text": "...", "start_time": "HH:MM", "end_time": "HH:MM",
      "description": "...", "place_name": "景点名" 或 null
    }]
  }]
}]`;

  const promptPath = '/tmp/kantian-v5-prompt.txt';
  fs.writeFileSync(promptPath, prompt);
  console.log(`   ${prompt.length} chars`);

  // === Step 5: 生成 ===
  console.log('\n🤖 生成...');
  try {
    const output = await callLLM(prompt);
    let jsonStr = output;
    const codeBlockMatch = output.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) jsonStr = codeBlockMatch[1];
    const start = jsonStr.indexOf('[');
    const end = jsonStr.lastIndexOf(']') + 1;
    if (start === -1 || end === 0) {
      console.error('   ❌ 无效 JSON');
      console.error('   Raw:', output.slice(0, 300));
      process.exit(1);
    }
    const plans = JSON.parse(jsonStr.slice(start, end));
    console.log(`   ✅ ${plans.length} 个方案`);

    // === Step 6: 解析坐标 ===
    console.log('\n🔧 解析坐标...');
    let fromCache = 0, searched = 0, notFound = 0;
    for (const plan of plans) {
      for (const day of plan.days || []) {
        for (const step of day.steps || []) {
          const name = step.place_name;
          if (!name) continue;
          if (poiByName[name]) {
            step._coords = poiByName[name];
            fromCache++;
          } else {
            try {
              const results = await amap.searchPOI(name, { city: LOCATION.slice(0, 2) });
              if (results[0]) {
                step._coords = { name: results[0].name, lat: results[0].location.lat, lng: results[0].location.lng };
                poiByName[name] = step._coords;
                searched++;
              } else { notFound++; }
            } catch(e) { notFound++; }
            await new Promise(r => setTimeout(r, 400));
          }
        }
      }
    }
    console.log(`   缓存:${fromCache} 搜索:${searched} 未找到:${notFound}`);

    // === Step 7: 路线校验 ===
    console.log('\n📐 路线校验...');
    for (const plan of plans) {
      for (const day of plan.days || []) {
        const check = checkRouteOrder(day.steps || []);
        if (!check.ok) {
          console.log(`   ⚠️ "${plan.title}" Day${day.day_index}: 可能走回头路 (ratio:${check.ratio})`);
        }
      }
    }

    // === Step 8: 用餐时间校验 ===
    console.log('\n🍽️ 用餐时间校验...');
    for (const plan of plans) {
      for (const day of plan.days || []) {
        for (const step of day.steps || []) {
          if (step.type === 'eat' && step.start_time) {
            const h = parseInt(step.start_time.split(':')[0]);
            const m = parseInt(step.start_time.split(':')[1]);
            const t = h + m/60;
            // 午餐 11:00-13:30 或 晚餐 17:00-19:30 都算合理
            const isLunch = t >= 11 && t <= 13.5;
            const isDinner = t >= 17 && t <= 19.5;
            if (!isLunch && !isDinner) {
              console.log(`   ⚠️ "${plan.title}": ${step.text} 在 ${step.start_time}（不合理的用餐时间）`);
            }
          }
        }
      }
    }

    // === 输出 ===
    const outputName = `${LOCATION}-${TAG}.json`;
    const outputPath = path.join(GENERATED_DIR, outputName);
    ensureDir(GENERATED_DIR);
    fs.writeFileSync(outputPath, JSON.stringify({ plans, poiByName }, null, 2));
    console.log(`\n📦 ${outputPath}`);
    console.log('\n✨ 完成！');
    for (const p of plans) {
      console.log(`   • ${p.title} (${p.days?.length || 1}天) — ${(p.reason || '').slice(0, 60)}...`);
    }
  } catch(e) {
    console.error(`   ❌ ${e.message}`);
    process.exit(1);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
