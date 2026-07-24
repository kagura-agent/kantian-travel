/**
 * 看天出发 — 方案生成引擎
 * 
 * 流程：
 *   1. 读取 knowledge/ 静态目的地知识
 *   2. 调高德 API 拉实时数据（天气、路线、周边餐饮）
 *   3. 组装 prompt，调大模型生成方案
 *   4. 输出到 generated/
 * 
 * 用法：
 *   AMAP_KEY=xxx node scripts/generate.js --location 苏州吴江区 --tag 这周末
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const amap = require('../services/amap');

// === Config ===
const KNOWLEDGE_DIR = path.join(__dirname, '..', 'knowledge');
const GENERATED_DIR = path.join(__dirname, '..', 'generated');

// === CLI Args ===
const args = {};
process.argv.slice(2).forEach((arg, i, arr) => {
  if (arg.startsWith('--')) args[arg.slice(2)] = arr[i + 1];
});

const LOCATION = args.location || '苏州吴江区';
const TAG = args.tag || '明天';

// 从 location 解析城市和区
const CITY = LOCATION.replace(/(市|区|县)$/, '').slice(0, LOCATION.includes('市') ? LOCATION.indexOf('市') : 2);
const DISTRICT = LOCATION.slice(CITY.length);

// District center coordinates (expand as needed)
const DISTRICT_CENTERS = {
  '苏州-吴江区': { lat: 31.160, lng: 120.645 },
  '苏州-姑苏区': { lat: 31.310, lng: 120.620 },
  '苏州-工业园区': { lat: 31.295, lng: 120.720 },
  '上海-浦东新区': { lat: 31.220, lng: 121.540 },
  '杭州-西湖区': { lat: 30.260, lng: 120.130 },
};

// Tag → date range
function getDateRange(tag) {
  const today = new Date();
  const fmt = d => d.toISOString().split('T')[0];
  const weekday = d => ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];

  switch (tag) {
    case '现在':
    case '今天': {
      return [{ date: fmt(today), weekday: `周${weekday(today)}` }];
    }
    case '明天': {
      const d = new Date(today);
      d.setDate(d.getDate() + 1);
      return [{ date: fmt(d), weekday: `周${weekday(d)}` }];
    }
    case '周六': {
      const sat = new Date(today);
      const daysUntilSat = (6 - sat.getDay() + 7) % 7 || 7;
      sat.setDate(sat.getDate() + daysUntilSat);
      return [{ date: fmt(sat), weekday: '周六' }];
    }
    case '周日': {
      const sun = new Date(today);
      const daysUntilSun = (7 - sun.getDay()) % 7 || 7;
      sun.setDate(sun.getDate() + daysUntilSun);
      return [{ date: fmt(sun), weekday: '周日' }];
    }
    case '这周末':
    case '周末2天': {
      const sat = new Date(today);
      sat.setDate(sat.getDate() + (6 - sat.getDay()));
      const sun = new Date(sat);
      sun.setDate(sun.getDate() + 1);
      return [
        { date: fmt(sat), weekday: `周${weekday(sat)}` },
        { date: fmt(sun), weekday: `周${weekday(sun)}` }
      ];
    }
    default:
      return [{ date: fmt(new Date(today.getTime() + 86400000)), weekday: '周六' }];
  }
}

// === Main ===
async function main() {
  amap.setKey(process.env.AMAP_KEY);
  if (!process.env.AMAP_KEY) { console.error('Missing AMAP_KEY'); process.exit(1); }

  const userLocation = DISTRICT_CENTERS[`${CITY}-${DISTRICT}`];
  if (!userLocation) { console.error(`Unknown district: ${CITY}-${DISTRICT}`); process.exit(1); }

  const dateRange = getDateRange(TAG);
  console.log(`\n🌤️  看天出发 — 方案生成`);
  console.log(`   用户: ${CITY}${DISTRICT}`);
  console.log(`   Tag: ${TAG} (${dateRange.map(d => d.date + ' ' + d.weekday).join(' + ')})`);
  console.log('');

  // === Step 1: 读取静态知识 ===
  console.log('📚 Step 1: 读取静态目的地知识...');
  const destDir = path.join(KNOWLEDGE_DIR, 'destinations');
  const actDir = path.join(KNOWLEDGE_DIR, 'activities');
  const destinations = fs.readdirSync(destDir).map(f => JSON.parse(fs.readFileSync(path.join(destDir, f), 'utf8')));
  const activities = fs.readdirSync(actDir).map(f => JSON.parse(fs.readFileSync(path.join(actDir, f), 'utf8')));
  console.log(`   ${destinations.length} 个目的地, ${activities.flat().length} 个玩法模板`);

  // === Step 2: 调高德拉实时数据 ===
  console.log('\n🗺️  Step 2: 拉取实时数据...');

  // 2a: 验证/补充 POI 坐标（用高德搜索确认）
  console.log('   搜索 POI...');
  const allPois = [];
  for (const dest of destinations) {
    for (const poi of dest.pois) {
      const results = await amap.searchPOI(poi.name, { city: dest.region, citylimit: true });
      if (results[0]) {
        allPois.push({
          id: results[0].id,
          name: results[0].name,
          type: poi.type || results[0].type?.split(';')[0] || '',
          lat: results[0].location.lat,
          lng: results[0].location.lng,
          destination: dest.name
        });
      }
      await new Promise(r => setTimeout(r, 500));
    }
  }
  console.log(`   找到 ${allPois.length} 个 POI`);

  // 2b: 搜索附近餐饮
  console.log('   搜索周边餐饮...');
  for (const dest of destinations) {
    const center = allPois.find(p => p.destination === dest.name);
    if (!center) continue;
    const food = await amap.searchNearby({ lat: center.lat, lng: center.lng }, '餐厅', 3000);
    for (const f of food.slice(0, 3)) {
      allPois.push({ id: f.id, name: f.name, type: '餐饮', lat: f.location.lat, lng: f.location.lng, destination: dest.name });
    }
    await new Promise(r => setTimeout(r, 200));
  }
  console.log(`   总计 ${allPois.length} 个 POI（含餐饮）`);

  // 2c: 路线规划
  console.log('   计算路线...');
  const routes = [];
  const destCenters = {};
  for (const dest of destinations) {
    const poi = allPois.find(p => p.destination === dest.name);
    if (poi) destCenters[dest.name] = { lat: poi.lat, lng: poi.lng };
  }

  // 用户 → 各目的地
  for (const [name, loc] of Object.entries(destCenters)) {
    const r = await amap.getRoute(userLocation, loc);
    routes.push({ from: DISTRICT, to: name, distance: r.distance + 'km', duration: r.durationText });
    await new Promise(r => setTimeout(r, 200));
  }
  // 目的地之间（两两）
  const destNames = Object.keys(destCenters);
  for (let i = 0; i < destNames.length; i++) {
    for (let j = i + 1; j < destNames.length; j++) {
      const r = await amap.getRoute(destCenters[destNames[i]], destCenters[destNames[j]]);
      routes.push({ from: destNames[i], to: destNames[j], distance: r.distance + 'km', duration: r.durationText });
      await new Promise(r => setTimeout(r, 200));
    }
  }
  console.log(`   ${routes.length} 条路线`);

  // 2d: 天气
  console.log('   查询天气...');
  const weatherByDest = {};
  const adcodes = { '莫干山': '330521', '西塘古镇': '330421' }; // extend as needed
  for (const dest of destinations) {
    const code = adcodes[dest.name] || dest.region;
    try {
      const w = await amap.getWeather(code);
      weatherByDest[dest.name] = w.forecasts;
    } catch (e) {
      console.log(`   ⚠️ 天气查询失败: ${dest.name}`);
    }
    await new Promise(r => setTimeout(r, 200));
  }

  // === Step 3: 组装 prompt ===
  console.log('\n✍️  Step 3: 组装生成 prompt...');
  let prompt = `=== 真实数据（高德 API 实时查询）===

用户：${CITY}${DISTRICT}
Tag：${TAG}（${dateRange.map(d => d.date + ' ' + d.weekday).join(' + ')}）

--- POI 列表（景点+餐饮+住宿）---
`;
  for (const p of allPois) prompt += `${p.id} | ${p.name} | ${p.type} | ${p.destination} | ${p.lat}, ${p.lng}\n`;

  prompt += `\n--- 路线（真实车程）---\n`;
  for (const r of routes) prompt += `${r.from} → ${r.to}: ${r.distance}, ${r.duration}\n`;

  prompt += `\n--- 天气预报 ---\n`;
  for (const [name, forecasts] of Object.entries(weatherByDest)) {
    prompt += `${name}:\n`;
    for (const f of forecasts) prompt += `  ${f.date} 周${f.week}: ${f.dayWeather} ${f.dayTemp}°/${f.nightTemp}°\n`;
  }

  prompt += `
=== 玩法模板参考 ===
`;
  for (const acts of activities) {
    for (const a of acts) {
      prompt += `- ${a.activity}（${a.destinationId}）: ${a.description} | 条件: ${JSON.stringify(a.conditions)} | 时长: ${a.duration}\n`;
    }
  }

  prompt += `
=== 生成要求 ===
生成 2-3 个方案数组。要求：
1. 基于玩法模板和实时天气，只选当前条件成立的活动
2. 至少一个多天方案（可串多目的地），至少一个单天
3. reason 基于真实天气说清为什么此刻适合
4. 高温天户外放早晚，午后室内/阴凉
5. 使用真实路程时间（不要自己估算）
6. 餐饮步骤使用上面列表中的真实餐厅 poi_id
7. 出发/到家 poi_id 为 null
8. 只输出纯 JSON 数组

格式：
[{
  "title": "...", "city": "${CITY}", "district": "${DISTRICT}", "tag": "${TAG}",
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

  // Save prompt
  const promptPath = '/tmp/kantian-generate-prompt.txt';
  fs.writeFileSync(promptPath, prompt);
  console.log(`   Prompt: ${prompt.length} chars`);
  console.log(`   Saved to: ${promptPath}`);

  // === Step 4: 调模型生成 ===
  console.log('\n🤖 Step 4: 调用大模型生成...');
  try {
    const output = execSync(
      `claude --print "你是一个旅行方案生成器。根据以下真实数据生成方案，只输出纯JSON数组：\n\n$(cat ${promptPath})"`,
      { encoding: 'utf8', maxBuffer: 1024 * 1024, timeout: 120000 }
    );

    // Parse JSON from output
    const start = output.indexOf('[');
    const end = output.lastIndexOf(']') + 1;
    if (start === -1 || end === 0) { console.error('   ❌ 模型未返回有效 JSON'); process.exit(1); }
    const plans = JSON.parse(output.slice(start, end));
    console.log(`   ✅ 生成 ${plans.length} 个方案`);

    // === Step 5: 输出 ===
    const outputName = `${CITY}${DISTRICT}-${TAG}.json`;
    const outputPath = path.join(GENERATED_DIR, outputName);
    fs.mkdirSync(GENERATED_DIR, { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(plans, null, 2));
    console.log(`\n📦 输出: ${outputPath}`);
    console.log('\n✨ 完成！');

    // Summary
    for (const p of plans) {
      const days = p.days?.length || 1;
      console.log(`   • ${p.title} (${days}天) — ${p.reason.slice(0, 50)}...`);
    }
  } catch (e) {
    console.error(`   ❌ 生成失败: ${e.message}`);
    process.exit(1);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
