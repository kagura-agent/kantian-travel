/**
 * 看天出发 — 方案生成引擎 v4
 * 
 * 新架构：无静态知识库，全动态发现 + 缓存积累
 * 
 * 流程：
 *   1. 根据用户位置+tag，确定搜索半径和时间范围
 *   2. 高德搜索半径内景点 → 缓存层查/存
 *   3. 计算路线（缓存层查/存）
 *   4. 拉天气（实时，不缓存）
 *   5. 查质量层（积累的条件知识+用户反馈）
 *   6. 组装 prompt → 大模型生成
 *   7. 输出方案
 * 
 * 用法：
 *   AMAP_KEY=*** node scripts/generate-v4.js --location 苏州工业园区 --tag 明天
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const amap = require('../services/amap');

// === Config ===
const CACHE_DIR = path.join(__dirname, '..', 'cache');
const GENERATED_DIR = path.join(__dirname, '..', 'generated');
const QUALITY_DIR = path.join(__dirname, '..', 'quality'); // 质量层积累

// Cache TTL
const POI_CACHE_TTL = 30 * 24 * 3600 * 1000;     // POI: 30天
const ROUTE_CACHE_TTL = 7 * 24 * 3600 * 1000;     // 路线: 7天
const PHOTO_CACHE_TTL = 90 * 24 * 3600 * 1000;    // 照片: 90天

// Tag → search radius (meters) + max drive time (minutes)
const TAG_CONFIG = {
  '今天': { radius: 80000, maxDrive: 90, days: 1 },
  '现在': { radius: 50000, maxDrive: 60, days: 1 },
  '明天': { radius: 120000, maxDrive: 120, days: 1 },
  '周六': { radius: 150000, maxDrive: 150, days: 1 },
  '周日': { radius: 150000, maxDrive: 150, days: 1 },
  '周末2天': { radius: 200000, maxDrive: 180, days: 2 },
  '这周末': { radius: 200000, maxDrive: 180, days: 2 },
};

// === CLI Args ===
const args = {};
process.argv.slice(2).forEach((arg, i, arr) => {
  if (arg.startsWith('--')) args[arg.slice(2)] = arr[i + 1];
});

const LOCATION = args.location || '苏州工业园区';
const TAG = args.tag || '明天';

// District centers
const DISTRICT_CENTERS = {
  '苏州工业园区': { lat: 31.295, lng: 120.720 },
  '苏州吴江区': { lat: 31.160, lng: 120.645 },
  '苏州姑苏区': { lat: 31.310, lng: 120.620 },
  '上海浦东新区': { lat: 31.220, lng: 121.540 },
  '杭州西湖区': { lat: 30.260, lng: 120.130 },
};

// === Cache Layer ===
function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }

function cacheGet(type, key) {
  const file = path.join(CACHE_DIR, type, `${key}.json`);
  if (!fs.existsSync(file)) return null;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const ttl = type === 'pois' ? POI_CACHE_TTL : type === 'routes' ? ROUTE_CACHE_TTL : POI_CACHE_TTL;
  if (Date.now() - data._cachedAt > ttl) return null; // expired
  return data;
}

function cacheSet(type, key, data) {
  ensureDir(path.join(CACHE_DIR, type));
  const file = path.join(CACHE_DIR, type, `${key}.json`);
  fs.writeFileSync(file, JSON.stringify({ ...data, _cachedAt: Date.now() }, null, 2));
}

// === Quality Layer ===
function getQualityNotes(poiId) {
  const file = path.join(QUALITY_DIR, `${poiId}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

// === Date Range ===
function getDateRange(tag) {
  const today = new Date();
  const fmt = d => d.toISOString().split('T')[0];
  const weekday = d => ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];

  switch (tag) {
    case '现在':
    case '今天':
      return [{ date: fmt(today), weekday: `周${weekday(today)}` }];
    case '明天': {
      const d = new Date(today); d.setDate(d.getDate() + 1);
      return [{ date: fmt(d), weekday: `周${weekday(d)}` }];
    }
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
    case '这周末':
    case '周末2天': {
      const sat = new Date(today);
      sat.setDate(sat.getDate() + ((6 - sat.getDay() + 7) % 7 || 7));
      const sun = new Date(sat); sun.setDate(sun.getDate() + 1);
      return [{ date: fmt(sat), weekday: '周六' }, { date: fmt(sun), weekday: '周日' }];
    }
    default:
      return [{ date: fmt(new Date(today.getTime() + 86400000)), weekday: '明天' }];
  }
}

// === Main ===
async function main() {
  amap.setKey(process.env.AMAP_KEY);
  if (!process.env.AMAP_KEY) { console.error('Missing AMAP_KEY'); process.exit(1); }

  const userLocation = DISTRICT_CENTERS[LOCATION];
  if (!userLocation) { console.error(`Unknown location: ${LOCATION}`); process.exit(1); }

  const tagConfig = TAG_CONFIG[TAG] || TAG_CONFIG['明天'];
  const dateRange = getDateRange(TAG);

  console.log(`\n🌤️  看天出发 — 方案生成 v4`);
  console.log(`   位置: ${LOCATION}`);
  console.log(`   Tag: ${TAG} (${dateRange.map(d => d.date + ' ' + d.weekday).join(' + ')})`);
  console.log(`   搜索半径: ${tagConfig.radius / 1000}km, 最大车程: ${tagConfig.maxDrive}min`);
  console.log('');

  // === Step 1: 动态发现景点 ===
  console.log('🔍 Step 1: 搜索可达景点...');
  const cacheKey = `${LOCATION}-${tagConfig.radius}`;
  let discoveredPois = cacheGet('discovery', cacheKey);

  if (!discoveredPois) {
    // 搜索多种类型的景点
    const types = ['风景名胜', '公园广场', '度假村', '古镇'];
    const allResults = [];
    for (const type of types) {
      const results = await amap.searchNearby(userLocation, type, tagConfig.radius);
      allResults.push(...results);
      await new Promise(r => setTimeout(r, 500));
    }
    // 去重
    const seen = new Set();
    discoveredPois = allResults.filter(p => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    }).map(p => ({
      id: p.id, name: p.name, type: p.type,
      lat: p.location.lat, lng: p.location.lng,
      distance: p.distance
    }));
    cacheSet('discovery', cacheKey, { pois: discoveredPois });
    console.log(`   发现 ${discoveredPois.length} 个景点（已缓存）`);
  } else {
    discoveredPois = discoveredPois.pois;
    console.log(`   命中缓存: ${discoveredPois.length} 个景点`);
  }

  // === Step 2: 计算路线（带缓存）===
  console.log('\n🚗 Step 2: 计算路线...');
  const poisWithRoutes = [];
  for (const poi of discoveredPois.slice(0, 20)) { // 取前20个计算路线
    const routeKey = `${LOCATION}-${poi.id}`;
    let route = cacheGet('routes', routeKey);
    if (!route) {
      try {
        route = await amap.getRoute(userLocation, { lat: poi.lat, lng: poi.lng });
        cacheSet('routes', routeKey, route);
      } catch (e) { continue; }
      await new Promise(r => setTimeout(r, 500));
    }
    if (route.duration <= tagConfig.maxDrive) {
      poisWithRoutes.push({ ...poi, route });
    }
  }
  console.log(`   ${poisWithRoutes.length} 个在${tagConfig.maxDrive}分钟车程内`);

  // === Step 3: 搜索餐饮 ===
  console.log('\n🍜 Step 3: 搜索周边餐饮...');
  const restaurants = [];
  // 取前5个目的地附近搜餐厅
  for (const poi of poisWithRoutes.slice(0, 5)) {
    const food = await amap.searchNearby({ lat: poi.lat, lng: poi.lng }, '餐厅', 2000);
    for (const f of food.slice(0, 2)) {
      restaurants.push({ id: f.id, name: f.name, type: '餐饮', lat: f.location.lat, lng: f.location.lng, nearPoi: poi.name });
    }
    await new Promise(r => setTimeout(r, 500));
  }
  console.log(`   找到 ${restaurants.length} 家餐厅`);

  // === Step 4: 天气（实时，不缓存）===
  console.log('\n🌡️ Step 4: 查询天气...');
  // 用用户所在城市的 adcode 查天气
  const adcodeMap = { '苏州': '320500', '上海': '310000', '杭州': '330100' };
  const cityName = LOCATION.slice(0, 2);
  const weather = await amap.getWeather(adcodeMap[cityName] || '320500');
  console.log(`   ${weather.city}:`);
  weather.forecasts.forEach(f => console.log(`   ${f.date} 周${f.week}: ${f.dayWeather} ${f.dayTemp}°/${f.nightTemp}°`));

  // === Step 5: 查质量层 ===
  console.log('\n⭐ Step 5: 查询质量数据...');
  let qualityNotes = '';
  for (const poi of poisWithRoutes) {
    const q = getQualityNotes(poi.id);
    if (q) {
      qualityNotes += `${poi.name}: ${q.notes}\n`;
    }
  }
  console.log(`   ${qualityNotes ? '有质量数据' : '暂无质量数据（冷启动）'}`);

  // === Step 6: 组装 prompt ===
  console.log('\n✍️ Step 6: 组装 prompt...');
  let prompt = `=== 数据（全部来自高德 API 实时查询）===

用户位置：${LOCATION}
Tag：${TAG}（${dateRange.map(d => d.date + ' ' + d.weekday).join(' + ')}）
行程天数：${tagConfig.days}天

--- 可达景点（${tagConfig.maxDrive}分钟车程内）---
`;
  for (const p of poisWithRoutes) {
    prompt += `${p.id} | ${p.name} | ${p.type || ''} | ${p.route.distance}km ${p.route.durationText}\n`;
  }

  prompt += `\n--- 周边餐饮 ---\n`;
  for (const r of restaurants) {
    prompt += `${r.id} | ${r.name} | 靠近${r.nearPoi}\n`;
  }

  prompt += `\n--- 天气预报 ---\n`;
  for (const f of weather.forecasts) {
    prompt += `${f.date} 周${f.week}: ${f.dayWeather} ${f.dayTemp}°/${f.nightTemp}°\n`;
  }

  if (qualityNotes) {
    prompt += `\n--- 质量参考（用户积累）---\n${qualityNotes}`;
  }

  prompt += `
=== 生成要求 ===
生成 3-5 个方案。要求：
1. 从上面的可达景点中选择，只选当前天气条件适合的
2. 每个方案的 reason 说清为什么此刻适合（基于天气、距离、时间）
3. 高温天户外放早晚，午后室内/阴凉
4. 使用真实路程时间
5. 餐饮用上面列表中的真实餐厅 poi_id
6. 出发/到家 poi_id 为 null
7. 只输出纯 JSON 数组

格式：
[{
  "title": "...", "location": "${LOCATION}", "tag": "${TAG}",
  "valid_date": ${dateRange.length > 1 ? '["' + dateRange.map(d => d.date).join('", "') + '"]' : '"' + dateRange[0].date + '"'},
  "reason": "...",
  "weather": { "desc": "...", "high": N, "low": N },
  "days": [{
    "day_index": 0, "activity": "...",
    "weather": { "desc": "...", "high": N, "low": N },
    "steps": [{
      "step_index": 0, "type": "depart/transit/play/eat/stay/home",
      "text": "...", "start_time": "HH:MM", "end_time": "HH:MM",
      "description": "...", "poi_id": "Bxxx" 或 null
    }]
  }]
}]`;

  const promptPath = '/tmp/kantian-v4-prompt.txt';
  fs.writeFileSync(promptPath, prompt);
  console.log(`   Prompt: ${prompt.length} chars`);

  // === Step 7: 调模型生成 ===
  console.log('\n🤖 Step 7: 生成方案...');
  try {
    const output = execSync(
      `claude --print "你是一个旅行方案生成器。根据以下真实数据生成方案，只输出纯JSON数组：\n\n$(cat ${promptPath})"`,
      { encoding: 'utf8', maxBuffer: 1024 * 1024, timeout: 120000 }
    );

    const start = output.indexOf('[');
    const end = output.lastIndexOf(']') + 1;
    if (start === -1 || end === 0) { console.error('   ❌ 模型未返回有效 JSON'); process.exit(1); }
    const plans = JSON.parse(output.slice(start, end));
    console.log(`   ✅ 生成 ${plans.length} 个方案`);

    // Output
    const outputName = `${LOCATION}-${TAG}.json`;
    const outputPath = path.join(GENERATED_DIR, outputName);
    ensureDir(GENERATED_DIR);
    fs.writeFileSync(outputPath, JSON.stringify(plans, null, 2));
    console.log(`\n📦 输出: ${outputPath}`);
    console.log('\n✨ 完成！');
    for (const p of plans) {
      console.log(`   • ${p.title} (${p.days?.length || 1}天) — ${(p.reason || '').slice(0, 50)}...`);
    }
  } catch (e) {
    console.error(`   ❌ 生成失败: ${e.message}`);
    process.exit(1);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
