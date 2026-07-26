#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// === Load original data ===
const raw = fs.readFileSync(path.join(__dirname, 'data.js'), 'utf-8');
const loadFn = new Function(raw + '\nreturn { PLANS, RELATED_CONTENT, TIMELINES, PLAN_TIPS, STEP_DETAILS };');
const { PLANS, RELATED_CONTENT, TIMELINES, PLAN_TIPS, STEP_DETAILS } = loadFn();

// === ID mapping ===
const ID_MAP = {
  1: 'moganshan-weekend',
  2: 'xitang-night',
  3: 'taihu-dongshan-yangmei',
  4: 'jingshan-tea',
  5: 'nanxun-quiet',
  6: 'wannan-sketch-3d',
  7: 'qiandaohu-cycling-3d',
  8: 'zhemin-shanhai-7d',
  9: 'jiangnan-watertown-5d',
  10: 'huizhou-deep-7d',
  11: 'tongli-halfday',
  12: 'lingyanshan-hike',
  13: 'yangchenghu-cycling',
  14: 'zhenan-shanshui-5d',
  15: 'pingjianglu-walk',
  16: 'jinjihu-sunset',
  17: 'guanqianjie-night'
};

// === Helpers ===

function getStepType(text) {
  text = text.trim();
  if (/^回家$/.test(text)) return 'home';
  if (/^回酒店$|^回民宿$/.test(text)) return 'transit';
  if (/^出发/.test(text)) return 'depart';
  // Stay
  if (/入住|住山顶/.test(text)) return 'stay';
  // Eat — check before transit because some eat steps have place names with transit-like words
  if (/午餐|晚餐|早餐|早茶|夜市扫街/.test(text)) return 'eat';
  if (/^民宿早餐/.test(text)) return 'eat';
  if (/^湖景晚餐/.test(text)) return 'eat';
  if (/咖啡馆/.test(text)) return 'eat'; // coffee shops are eat
  if (/^河边晚餐/.test(text)) return 'eat';
  if (/^溪边午餐/.test(text)) return 'eat';
  if (/^湖边咖啡/.test(text)) return 'eat';
  if (/^野餐/.test(text)) return 'eat';
  // Transit — starts with transport keyword
  if (/^(高铁|自驾|打车|地铁|公交|换乘|包车|坐船|索道|还车)/.test(text)) return 'transit';
  if (/^骑行\/自驾/.test(text)) return 'transit';
  if (/^步行\/地铁/.test(text)) return 'transit';
  if (/^租车\/自驾/.test(text)) return 'transit';
  if (/^公交\/打车/.test(text)) return 'transit';
  if (/^公交\/包车/.test(text)) return 'transit';
  if (/^地铁\d/.test(text)) return 'transit'; // 地铁1号线到...
  if (/^地铁到/.test(text)) return 'transit';
  if (/^租车$/.test(text)) return 'transit';
  if (/^租自行车$/.test(text)) return 'transit';
  // Transit patterns in middle of text
  if (/(?:打车|高铁|自驾|包车)(?:\d|到|返回)/.test(text) && !/午餐|晚餐/.test(text)) return 'transit';
  if (/^下山$/.test(text)) return 'transit';
  if (/^下山→/.test(text)) return 'transit';
  // Everything else
  return 'play';
}

function extractPlaceName(text, type) {
  if (type === 'home') return null;
  let clean = text.replace(/\([^)]*\)/g, '').trim();
  let m;

  // "出发去苏州站" → "苏州站"
  if ((m = clean.match(/出发去(.+)/))) return m[1].trim();

  // Transit destinations: "高铁47min到德清站" → "德清站"
  if (type === 'transit') {
    if ((m = clean.match(/(?:到|返回)([^→]+)$/))) return m[1].trim();
    if (/^回酒店$/.test(clean)) return '酒店';
    if (/^回民宿$/.test(clean)) return '民宿';
    return null;
  }

  // "入住莫干山民宿" → "莫干山民宿"
  if (type === 'stay') {
    if ((m = clean.match(/入住(.+)/))) return m[1].trim();
    if (/住山顶/.test(clean)) return '黄山山顶';
    return null;
  }

  // Eat: "庾村文创小镇午餐" → "庾村文创小镇"
  if (type === 'eat') {
    if ((m = clean.match(/^(.+?)(?:午餐|晚餐|早餐|早茶|咖啡)(.*)$/))) {
      let name = m[1].trim();
      // Filter out generic/non-place descriptions
      const genericEat = /^(民宿|湖景|溪边|河边|湖边|山下|山顶|民宿|农家|农家菜)$/;
      if (name && name.length >= 2 && !genericEat.test(name)) return name;
    }
    return null;
  }

  // Play/depart: try STEP_DETAILS keys
  for (const key of Object.keys(STEP_DETAILS)) {
    if (clean.includes(key)) return key;
  }

  return null;
}

function findStepDetail(text) {
  let clean = text.replace(/\([^)]*\)/g, '').trim();
  let bestKey = null;
  let bestLen = 0;
  for (const key of Object.keys(STEP_DETAILS)) {
    if (clean.includes(key) && key.length > bestLen) {
      bestKey = key;
      bestLen = key.length;
    }
  }
  return bestKey ? { _key: bestKey, ...STEP_DETAILS[bestKey] } : null;
}

function parseDurationStr(str) {
  if (!str) return null;
  let m;
  if ((m = str.match(/(\d+)min/))) return parseInt(m[1]);
  if ((m = str.match(/(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)h/))) return ((parseFloat(m[1]) + parseFloat(m[2])) / 2) * 60;
  if ((m = str.match(/(\d+(?:\.\d+)?)h/))) return parseFloat(m[1]) * 60;
  if (str === '全天') return 360;
  if (str === '半天') return 240;
  if (str.includes('半天-1天')) return 300;
  return null;
}

function estimateDuration(text, type, detail) {
  let m;
  // From text: "高铁47min", "自驾1.5h", "打车25min", "(约2h)"
  if ((m = text.match(/(\d+)min/))) return parseInt(m[1]);
  if ((m = text.match(/(\d+(?:\.\d+)?)h/))) return parseFloat(m[1]) * 60;
  // From parenthetical: "(约2h)"
  if ((m = text.match(/\(约?(\d+(?:\.\d+)?)h\)/))) return parseFloat(m[1]) * 60;
  if ((m = text.match(/\((\d+)min\)/))) return parseInt(m[1]);

  // For transit steps, DON'T use STEP_DETAILS duration (it's for the place, not the transit)
  // Only use STEP_DETAILS for non-transit types
  if (type !== 'transit' && type !== 'depart' && detail && detail.duration) {
    const d = parseDurationStr(detail.duration);
    if (d) return d;
  }

  // Defaults by type
  const defaults = {
    depart: 30, transit: 30, play: 90, eat: 60, stay: 30, home: 0
  };
  return defaults[type] || 60;
}

function formatTime(mins) {
  // Handle overflow past midnight
  if (mins >= 1440) mins = mins % 1440;
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  return `${h}:${m.toString().padStart(2, '0')}`;
}

function isEveningActivity(text) {
  return /晚上|夜游|夜景|萤火虫|夜市|酒吧/.test(text);
}

function isEarlyMorning(text) {
  return /日出|清晨|晨光|晨雾|6点/.test(text);
}

// Parse transit string like "高铁47min · 德清"
function parseTransitStr(str) {
  const parts = str.split('·').map(s => s.trim());
  const first = parts[0];
  const destination = (parts[1] || '').trim();
  let m;
  if ((m = first.match(/^(.+?)(\d[\d.]*(?:h|min))(.*)$/))) {
    return { mode: m[1].trim(), duration: m[2], destination };
  }
  // "高铁起步" etc
  if ((m = first.match(/^(.+?)(\d[\d.]*(?:h|min))?(.*)$/))) {
    return { mode: m[1].trim(), duration: m[2] || '', destination };
  }
  return { mode: first, duration: '', destination };
}

// Build price object
function buildPrice(plan) {
  const p = {};
  if (plan.price) {
    if (plan.price.includes('/晚')) {
      p.accommodation = plan.price;
    } else if (plan.price.includes('人均')) {
      p.perPerson = plan.price;
    } else {
      p.total = plan.price;
    }
  }
  return p;
}

// Tip matching
function matchTipToStep(tip, stepText, type, placeName) {
  const tl = tip.toLowerCase();
  const sl = stepText.toLowerCase();
  if (placeName && tl.includes(placeName.toLowerCase())) return true;

  // Keyword pairs: [tipKeyword, stepKeyword]
  const pairs = [
    ['运动鞋', '徒步'], ['运动鞋', '步道'],
    ['萤火虫', '萤火虫'],
    ['民宿', null], // match stay type
    ['杨梅', '杨梅'], ['防晒', '骑行'], ['蚊子', '古道'], ['蚊子', '徒步'],
    ['炒茶', '炒茶'], ['温差', null], // match stay
    ['闭馆', '博物馆'], ['日落', '日落'], ['日落', '百间楼'],
    ['写生', '写生'], ['秋天', '塔川'],
    ['骑行', '骑行'], ['骑行', '环湖'],
    ['古村', '芹川'], ['古村', '古村'],
    ['日出', '日出'], ['日出', '排云亭'],
    ['退思园', '退思园'], ['状元蹄', '状元蹄'], ['状元蹄', '午餐'],
    ['北坡', '灵岩山'], ['灵岩寺', '灵岩寺'], ['鲃肺汤', '木渎'],
    ['莲花岛', '莲花岛'], ['蚊子', '莲花岛'], ['蚊子', '日落'],
    ['索道', '索道'], ['索道', '神仙居'],
    ['联票', '周庄'], ['联票', '古镇'],
    ['夜景', '夜景'], ['夜景', '夜游'],
    ['山顶', '住山顶'], ['山顶', '黄山'],
    ['西递', '西递'],
    ['下涯', '下涯'], ['晨雾', '下涯'],
    ['神仙居', '神仙居'], ['草莓', '建德'],
    ['加油站', '自驾'], ['太姥山', '太姥山'],
    ['滩涂', '滩涂'], ['滩涂', '日出'],
    ['门票', '免门票'],
    ['清晨', '清晨'], ['清晨', '拍照'],
    ['酒吧', '酒吧'],
    ['讲价', '农家乐'],
    ['驱蚊', '古道'], ['驱蚊', '徒步'],
    ['预约', '炒茶'], ['外套', null], // stay
    ['提前', '民宿'], ['提前', '入住'],
    ['农家乐', '农家乐'],
    ['双桥', '双桥'], ['双桥', '周庄'],
  ];

  for (const [tipKw, stepKw] of pairs) {
    if (tl.includes(tipKw)) {
      if (stepKw === null) {
        // Match stay type for accommodation tips
        if (type === 'stay') return true;
      } else if (sl.includes(stepKw)) {
        return true;
      }
    }
  }

  // Special: tip about 门票 matches first play step
  if (tl.includes('门票') && type === 'play') {
    // Only match if the step is about the main attraction
    if (sl.includes('门票') || sl.includes('景区') || sl.includes('古镇') || sl.includes('退思园')) return true;
  }
  if (tl.includes('免门票') && type === 'depart') return false;
  if (tl.includes('下午5点') && (sl.includes('古镇') || sl.includes('入场'))) return true;

  return false;
}

// Content matching — split into activity-based and place-based
function matchContentByActivity(content, stepText) {
  const title = content.title.toLowerCase();
  const text = stepText.toLowerCase();
  const pairs = [
    ['骑行', '骑行'], ['徒步', '徒步'], ['夜游', '夜游'], ['夜景', '夜景'],
    ['写生', '写生'], ['日出', '日出'], ['萤火虫', '萤火虫'],
    ['杨梅', '杨梅'], ['炒茶', '炒茶'], ['滩涂', '滩涂'],
    ['自驾', '自驾'], ['晨雾', '晨雾'], ['晨雾', '下涯'],
    ['夜', '酒吧'], ['夜', '夜市'],
    ['清晨', '清晨'], ['清晨', '拍空巷'], ['清晨', '拍照'],
    ['木雕', '卢村'],
  ];
  for (const [ck, sk] of pairs) {
    if (title.includes(ck) && text.includes(sk)) return true;
  }
  return false;
}

function matchContentByPlace(content, placeName) {
  if (!placeName) return false;
  const title = content.title.toLowerCase();
  const pl = placeName.toLowerCase();
  // Only match on specific attraction/location names, not stations or generic places
  const genericPlaces = ['苏州站', '德清站', '嘉善南站', '湖州站', '黄山北', '千岛湖站',
    '丽水站', '建德站', '杭州站', '福鼎站',
    '临水客栈', '莫干山民宿', '民宿', '客栈', '酒店', '农家乐', '茶宿',
    '明清街', '溪边', '河边', '湖边', '山下', '山顶'];
  if (genericPlaces.some(g => pl === g || g === pl)) return false;
  if (pl.length < 2) return false;
  return title.includes(pl);
}

// Generate bookings for a step
function generateBookings(text, type, detail) {
  const bookings = [];
  if (type === 'transit' && /高铁/.test(text)) {
    bookings.push({ type: 'train', label: /返回/.test(text) ? '查回程票' : '查高铁票', url: 'https://www.12306.cn' });
  }
  if (type === 'stay') {
    bookings.push({ type: 'hotel', label: '查住宿' });
  }
  if (type === 'play') {
    if (/租.*车|租自行车/.test(text)) bookings.push({ type: 'bike', label: '租车' });
    if (/坐船|游船/.test(text)) bookings.push({ type: 'boat', label: '查船票' });
    if (detail && detail.cost && /门票/.test(detail.cost)) bookings.push({ type: 'ticket', label: '查门票' });
  }
  if (type === 'transit') {
    if (/租车/.test(text)) bookings.push({ type: 'car', label: '租车' });
  }
  return bookings.length > 0 ? bookings : undefined;
}

// === Main conversion ===

function convertPlan(plan) {
  const planId = plan.id;
  const tips = PLAN_TIPS[planId] || [];
  const content = (RELATED_CONTENT[planId] || []).map(c => {
    const { color, ...rest } = c;
    return rest;
  });
  const tl = TIMELINES[planId];

  // Basic fields
  const transit = parseTransitStr(plan.transit);
  const price = buildPrice(plan);

  // Determine how to map fullItinerary entries to days
  const itinEntries = plan.detail.fullItinerary;
  const numDays = plan.days.length;

  // Build day-to-itinerary mapping
  // If more itinerary entries than days, merge into days
  const dayStepTexts = [];
  if (itinEntries.length <= numDays) {
    // 1:1 or fewer itinerary than days (shouldn't happen, but handle)
    for (let i = 0; i < numDays; i++) {
      const itin = itinEntries[i];
      if (itin) {
        dayStepTexts.push(itin.content.split('→').map(s => s.trim()).filter(Boolean));
      } else {
        dayStepTexts.push([]);
      }
    }
  } else {
    // More itinerary entries than days (e.g., single-day with 上午/下午)
    // Merge all into available days, distributing evenly
    const allSteps = [];
    for (const itin of itinEntries) {
      allSteps.push(...itin.content.split('→').map(s => s.trim()).filter(Boolean));
    }
    // For single-day plans, put all in day 0
    if (numDays === 1) {
      dayStepTexts.push(allSteps);
    } else {
      // Distribute across days (shouldn't happen much)
      const perDay = Math.ceil(allSteps.length / numDays);
      for (let i = 0; i < numDays; i++) {
        dayStepTexts.push(allSteps.slice(i * perDay, (i + 1) * perDay));
      }
    }
  }

  // Compute day time boundaries from timeline
  let dayBounds = null;
  if (tl) {
    dayBounds = [];
    let daySegs = [];
    for (const seg of tl) {
      if (seg.type === 'sleep') {
        dayBounds.push({ segments: daySegs, sleepEnd: seg.end });
        daySegs = [];
      } else {
        daySegs.push(seg);
      }
    }
    if (daySegs.length > 0) dayBounds.push({ segments: daySegs });
  }

  // Track used tips and content globally
  const usedTips = new Set();
  const usedContent = new Set();

  // Build days
  const newDays = [];
  for (let di = 0; di < numDays; di++) {
    const dayInfo = plan.days[di];
    const rawSteps = dayStepTexts[di] || [];
    const dayLabel = (itinEntries[di] || {}).label || '';

    // Determine start time
    let startMins = 480; // 8:00
    if (dayLabel.includes('下午')) startMins = 840; // 14:00
    else if (dayLabel.includes('傍晚')) startMins = 960; // 16:00
    else if (dayLabel.includes('晚上') || dayLabel.includes('今晚')) startMins = 1140; // 19:00
    else if (dayLabel.includes('上午')) startMins = 540; // 9:00

    // For multi-entry single-day plans that merged, use the earliest start
    if (numDays === 1 && itinEntries.length > 1) {
      const firstLabel = itinEntries[0].label || '';
      if (firstLabel.includes('上午')) startMins = 540;
    }

    // Heuristic: if Day 1 is evening-oriented (夜游/夜景/酒吧), start later
    if (di === 0 && startMins <= 480) {
      const act = dayInfo.activity || '';
      if (/夜游|夜景|夜市|酒吧|深夜/.test(act)) startMins = 900; // 15:00
      else if (/日落/.test(act) && !/徒步|骑行/.test(act)) startMins = 840; // 14:00
    }

    let currentTime = startMins;
    const steps = [];

    for (let si = 0; si < rawSteps.length; si++) {
      const rawText = rawSteps[si];
      const type = getStepType(rawText);
      const placeName = extractPlaceName(rawText, type);
      const detail = findStepDetail(rawText);
      const dur = estimateDuration(rawText, type, detail);

      // Time override for evening/early morning
      if (isEveningActivity(rawText) && currentTime < 1140) {
        // Evening: at least 19:00 or 20:00
        if (/萤火虫|夜景/.test(rawText)) currentTime = Math.max(currentTime, 1200); // 20:00
        else currentTime = Math.max(currentTime, 1140); // 19:00
      }
      if (isEarlyMorning(rawText) && di > 0) {
        // Early morning on subsequent days, reset to early
        if (/4:30/.test(rawText) || /4点半/.test(rawText)) currentTime = 270; // 4:30
        else currentTime = Math.max(startMins, 360); // 6:00
      }

      // Build step object
      const step = {
        text: rawText.replace(/\([^)]*\)/g, '').trim(),
        type,
        time: formatTime(currentTime)
      };

      if (placeName) step.place = { name: placeName };

      // Description from STEP_DETAILS
      if (detail) {
        if (detail.desc) step.description = detail.desc;
        if (detail.duration) step.duration = detail.duration;
        if (detail.cost) step.cost = detail.cost;
      }

      // Extract cost/info from parenthetical
      let pm;
      if ((pm = rawText.match(/\(([^)]+)\)/))) {
        const paren = pm[1];
        if (/^¥/.test(paren) && !step.cost) {
          step.cost = paren;
        } else if (/限定|必吃|最美|人超少/.test(paren)) {
          if (!step.tips) step.tips = [];
          step.tips.push(paren);
        } else if (!step.description && paren.length > 2) {
          step.description = paren;
        }
      }

      // Match tips
      const stepTips = [];
      for (let ti = 0; ti < tips.length; ti++) {
        if (usedTips.has(ti)) continue;
        if (matchTipToStep(tips[ti], rawText, type, placeName)) {
          stepTips.push(tips[ti]);
          usedTips.add(ti);
        }
      }
      if (stepTips.length > 0) {
        step.tips = [...(step.tips || []), ...stepTips];
      }

      // Match related content — two-pass: activity keywords first, then place name
      const stepContent = [];
      // Pass 1: activity keyword match (more specific)
      for (let ci = 0; ci < content.length; ci++) {
        if (usedContent.has(ci)) continue;
        if (matchContentByActivity(content[ci], rawText)) {
          stepContent.push(content[ci]);
          usedContent.add(ci);
        }
      }
      // Pass 2: place name match (less specific, only for unmatched content)
      if (placeName && type !== 'transit' && type !== 'depart') {
        for (let ci = 0; ci < content.length; ci++) {
          if (usedContent.has(ci)) continue;
          if (matchContentByPlace(content[ci], placeName)) {
            stepContent.push(content[ci]);
            usedContent.add(ci);
          }
        }
      }
      if (stepContent.length > 0) step.relatedContent = stepContent;

      // Bookings
      const bookings = generateBookings(rawText, type, detail);
      if (bookings) step.bookings = bookings;

      steps.push(step);
      currentTime += dur;
    }

    newDays.push({
      weather: dayInfo.weather,
      photo: dayInfo.photo,
      activity: dayInfo.activity,
      steps
    });
  }

  // Collect unmatched content for plan-level
  const unmatchedContent = content.filter((_, i) => !usedContent.has(i));

  // Collect unmatched tips — attach to plan-level relatedContent as general tips
  // Actually, unmatched tips can be stored at plan level; we'll note them
  const unmatchedTips = tips.filter((_, i) => !usedTips.has(i));

  return {
    id: ID_MAP[planId] || `plan-${planId}`,
    title: plan.title,
    subtitle: plan.days[0].activity,
    origin: '苏州',
    duration: plan.duration,
    category: plan.category,
    price,
    transit,
    route: plan.route,
    days: newDays,
    relatedContent: unmatchedContent,
    // Store unmatched tips at plan level for fallback
    ...(unmatchedTips.length > 0 ? { tips: unmatchedTips } : {})
  };
}

// === Execute ===
const PLANS_V2 = PLANS.map(p => convertPlan(p));

// Separate out plan-level related content that wasn't matched to any step
// (already included in each plan's relatedContent field)

// Format output
let output = `// data-v2.js — Structured travel plan data
// Generated from data.js, schema defined in DATA-SCHEMA.md
// All 17 plans converted to step-based structure

const PLANS_V2 = ${JSON.stringify(PLANS_V2, null, 2)};

// Plan-level related content fallback (for content not matched to specific steps)
// Already included in each plan's relatedContent field above.
// This export keeps the original RELATED_CONTENT for backward compatibility.
const RELATED_CONTENT_V2 = ${JSON.stringify(
  Object.fromEntries(
    Object.entries(RELATED_CONTENT).map(([k, v]) => [
      k,
      v.map(({ color, ...rest }) => rest)
    ])
  ),
  null,
  2
)};
`;

fs.writeFileSync(path.join(__dirname, 'data-v2.js'), output);
console.log(`✅ Written data-v2.js (${PLANS_V2.length} plans)`);

// Validation summary
for (const plan of PLANS_V2) {
  const totalSteps = plan.days.reduce((s, d) => s + d.steps.length, 0);
  const tipsCount = plan.days.reduce((s, d) => s + d.steps.reduce((s2, st) => s2 + (st.tips ? st.tips.length : 0), 0), 0);
  const contentCount = plan.days.reduce((s, d) => s + d.steps.reduce((s2, st) => s2 + (st.relatedContent ? st.relatedContent.length : 0), 0), 0);
  console.log(`  ${plan.id}: ${plan.days.length} days, ${totalSteps} steps, ${tipsCount} tips matched, ${contentCount} content matched, ${plan.relatedContent.length} unmatched content, ${(plan.tips || []).length} unmatched tips`);
}
