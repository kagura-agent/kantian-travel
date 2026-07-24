const amap = require('../services/amap');
const fs = require('fs');

amap.setKey(process.env.AMAP_KEY);

(async () => {
  const userLocation = { lat: 31.160, lng: 120.645, district: '吴江区', city: '苏州' };
  const dates = ['2026-07-26（周六）', '2026-07-27（周日）'];

  // === Step 1: POI 搜索 ===
  const poiQueries = [
    { q: '莫干山风景区南门售票处', city: '湖州' },
    { q: '莫干山大竹海', city: '湖州' },
    { q: '庾村市集 莫干山', city: '湖州' },
    { q: '裸心谷度假村 莫干山', city: '湖州' },
    { q: '西塘古镇景区', city: '嘉兴' },
    { q: '烟雨长廊 西塘', city: '嘉兴' },
    { q: '石皮弄 西塘', city: '嘉兴' },
    { q: '西塘酒吧街', city: '嘉兴' },
  ];

  const pois = [];
  for (const pq of poiQueries) {
    const results = await amap.searchPOI(pq.q, { city: pq.city, citylimit: true });
    if (results[0]) pois.push({ id: results[0].id, name: results[0].name, type: results[0].type?.split(';')[0] || '', lat: results[0].location.lat, lng: results[0].location.lng });
    await new Promise(r => setTimeout(r, 200));
  }

  // 餐饮 POI
  const foodNearMoganshan = await amap.searchNearby({ lat: 30.599, lng: 119.897 }, '餐厅', 3000);
  for (const f of foodNearMoganshan.slice(0, 3)) {
    pois.push({ id: f.id, name: f.name, type: '餐饮', lat: f.location.lat, lng: f.location.lng });
  }
  await new Promise(r => setTimeout(r, 200));
  const foodNearXitang = await amap.searchNearby({ lat: 30.943, lng: 120.894 }, '餐厅', 1000);
  for (const f of foodNearXitang.slice(0, 3)) {
    pois.push({ id: f.id, name: f.name, type: '餐饮', lat: f.location.lat, lng: f.location.lng });
  }

  // === Step 2: 路线规划 ===
  const routes = [];
  const moganshan = { lat: 30.599, lng: 119.862 };
  const xitang = { lat: 30.943, lng: 120.894 };

  const r1 = await amap.getRoute(userLocation, moganshan);
  routes.push({ from: '吴江区', to: '莫干山南门', distance: r1.distance + 'km', duration: r1.durationText });
  await new Promise(r => setTimeout(r, 200));
  const r2 = await amap.getRoute(userLocation, xitang);
  routes.push({ from: '吴江区', to: '西塘古镇', distance: r2.distance + 'km', duration: r2.durationText });
  await new Promise(r => setTimeout(r, 200));
  const r3 = await amap.getRoute(xitang, moganshan);
  routes.push({ from: '西塘古镇', to: '莫干山南门', distance: r3.distance + 'km', duration: r3.durationText });

  // === Step 3: 天气 ===
  const w1 = await amap.getWeather('330521');
  const w2 = await amap.getWeather('330421');

  // === 组装 prompt ===
  let prompt = `=== 真实数据（高德 API 实时查询）===

用户：苏州市吴江区
Tag：这周末（${dates.join(' + ')}）

--- POI 列表（景点+餐饮+住宿）---
`;
  for (const p of pois) prompt += `${p.id} | ${p.name} | ${p.type} | ${p.lat}, ${p.lng}\n`;

  prompt += `\n--- 路线（真实车程）---\n`;
  for (const r of routes) prompt += `${r.from} → ${r.to}: ${r.distance}, ${r.duration}\n`;

  prompt += `\n--- 天气预报 ---\n德清(莫干山):\n`;
  for (const f of w1.forecasts) prompt += `  ${f.date} 周${f.week}: ${f.dayWeather} ${f.dayTemp}°/${f.nightTemp}°\n`;
  prompt += '嘉善(西塘):\n';
  for (const f of w2.forecasts) prompt += `  ${f.date} 周${f.week}: ${f.dayWeather} ${f.dayTemp}°/${f.nightTemp}°\n`;

  prompt += `
=== 生成要求 ===
生成 2-3 个方案数组。要求：
1. 至少一个2天方案（可串多目的地），至少一个单天
2. reason 基于真实天气说清为什么此刻适合
3. 高温天户外放早晚，午后室内/阴凉
4. 使用真实路程时间（不要自己估算）
5. 餐饮步骤必须使用上面列表中的真实餐厅 poi_id
6. 出发/到家 poi_id 为 null
7. 只输出纯 JSON 数组

格式：
[{
  "title": "...", "city": "苏州", "district": "吴江区", "tag": "这周末",
  "valid_date": ["2026-07-26", "2026-07-27"] 或 "2026-07-26",
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

  fs.writeFileSync('/tmp/pipeline-v2-prompt.txt', prompt);
  console.log(`Prompt ready (${prompt.length} chars, ${pois.length} POIs, ${routes.length} routes)`);
})();
