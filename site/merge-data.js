// Script to merge missing fields from data.js into data-v2.js
// and convert to new schema (startTime/endTime, cost on bookings)

const fs = require('fs');

// Load original data (const → var for eval)
const origCode = fs.readFileSync('data.js', 'utf8')
  .replace(/^const /gm, 'var ');
eval(origCode);

// Load v2 data
const v2code = fs.readFileSync('data-v2.js', 'utf8');
const fn = new Function(v2code + '; return {PLANS_V2, RELATED_CONTENT_V2};');
const {PLANS_V2, RELATED_CONTENT_V2} = fn();

// Map original plans by title for matching
const origByTitle = {};
PLANS.forEach(p => { origByTitle[p.title] = p; });

// Step details lookup
const DETAILS = typeof STEP_DETAILS !== 'undefined' ? STEP_DETAILS : {};

PLANS_V2.forEach(plan => {
  const orig = origByTitle[plan.title];
  if (!orig) { console.warn('No match for:', plan.title); return; }

  // 1. Card-level fields
  if (!plan.legs) plan.legs = orig.legs || [];
  if (!plan.stayType) plan.stayType = orig.stayType || orig.detail?.accommodation?.split('，')[0] || '';
  if (!plan.price) plan.price = {};
  if (!plan.price.accommodation) plan.price.accommodation = orig.price || '';
  if (!plan.price.total) {
    // Estimate total from accommodation + transport
    const accMatch = (orig.price || '').match(/\d+/);
    const accPerNight = accMatch ? parseInt(accMatch[0]) : 300;
    const nights = Math.max(plan.days.length - 1, 0);
    const transportEst = orig.transit?.includes('高铁') ? 100 : 60;
    const activityEst = plan.days.length * 100;
    const low = Math.round((accPerNight * nights + transportEst + activityEst) / 100) * 100;
    const high = Math.round(low * 1.8 / 100) * 100;
    plan.price.total = nights > 0 ? `¥${low}-${high}/人` : `人均¥${low > 200 ? low : 100}-${Math.max(high, 200)}`;
  }

  // 2. Step-level: convert time→startTime+endTime, add missing fields
  plan.days.forEach((day, dayIdx) => {
    day.steps.forEach((step, stepIdx) => {
      // Convert time → startTime, compute endTime
      if (step.time && !step.startTime) {
        step.startTime = step.time;
        delete step.time;
      }
      if (!step.endTime && step.startTime) {
        // Compute from duration or next step's start
        const nextStep = day.steps[stepIdx + 1];
        if (nextStep && (nextStep.time || nextStep.startTime)) {
          step.endTime = nextStep.time || nextStep.startTime;
        } else if (step.duration) {
          // Parse duration to compute end
          const durMatch = step.duration.match(/(\d+)/);
          if (durMatch) {
            const [h, m] = step.startTime.split(':').map(Number);
            const durStr = step.duration;
            let addMin = parseInt(durMatch[0]);
            if (durStr.includes('h')) addMin *= 60;
            const endTotal = h * 60 + m + addMin;
            step.endTime = `${Math.floor(endTotal/60)}:${String(endTotal%60).padStart(2,'0')}`;
          }
        }
        if (!step.endTime) {
          // Default: 30min for transit, 1h for others
          const [h, m] = step.startTime.split(':').map(Number);
          const add = step.type === 'transit' ? 30 : step.type === 'home' ? 0 : 60;
          const et = h * 60 + m + add;
          step.endTime = `${Math.floor(et/60)}:${String(et%60).padStart(2,'0')}`;
        }
      }

      // Move cost to bookings
      if (step.cost && step.cost !== '免费') {
        if (!step.bookings || !step.bookings.length) {
          // Create a booking item based on step type
          const bType = step.type === 'transit' ? 'car' : step.type === 'stay' ? 'hotel' : step.type === 'eat' ? 'food' : 'ticket';
          const bLabel = step.type === 'transit' ? '交通' : step.type === 'stay' ? '查住宿' : step.type === 'eat' ? '查餐厅' : '查门票';
          step.bookings = [{type: bType, label: bLabel, cost: step.cost}];
        } else {
          // Add cost to first booking if missing
          if (!step.bookings[0].cost) step.bookings[0].cost = step.cost;
        }
      }
      if (step.cost === '免费' && step.bookings) {
        step.bookings.forEach(b => { if (!b.cost) b.cost = '免费'; });
      }
      delete step.cost;
      delete step.duration; // derived from startTime/endTime now

      // Fill missing place.name
      if (!step.place && step.type !== 'home') {
        const text = step.text || '';
        let name = text.replace(/[\(\)（）].*/g, '')
          .replace(/^.*?到/g, '').replace(/^.*?去/g, '')
          .replace(/(慢逛|闲逛|夜游|拍照|写生|徒步|骑行|品茶|观赏|休息|入住|散步|坐船|上岛|午餐|晚餐|早茶|早餐|吃|买|看|逛|游|玩|拍|走|登山|全天|返程|出发|到达|下山|上山|游览|采购|换乘|租车|还车|休整).*$/g, '')
          .replace(/(绝美|人超少|最美).*$/g, '').replace(/[\d]+km/g, '').trim();
        if (name) step.place = {name};
      }

      // Fill missing description from STEP_DETAILS
      if (!step.description && step.type !== 'home') {
        const text = step.text || '';
        const detail = Object.entries(DETAILS).find(([k]) => text.includes(k));
        if (detail) {
          step.description = detail[1].desc;
          if (detail[1].cost && !step.bookings?.some(b => b.cost)) {
            if (!step.bookings) step.bookings = [];
            if (step.bookings.length > 0 && !step.bookings[0].cost) {
              step.bookings[0].cost = detail[1].cost;
            }
          }
        } else {
          // Generate basic descriptions by type
          if (step.type === 'depart') step.description = '提前出发，预留充足时间';
          else if (step.type === 'transit') step.description = '按导航路线前往';
        }
      }
    });
  });
});

// Write output
let output = '// data-v2.js — Structured travel plan data\n';
output += '// Generated from data.js, schema defined in DATA-SCHEMA.md\n';
output += '// All 17 plans converted to step-based structure\n\n';
output += 'const PLANS_V2 = ' + JSON.stringify(PLANS_V2, null, 2) + ';\n\n';
output += 'const RELATED_CONTENT_V2 = ' + JSON.stringify(RELATED_CONTENT_V2, null, 2) + ';\n';

fs.writeFileSync('data-v2.js', output);
console.log('✅ Written data-v2.js');

// Verify
require('child_process').execSync('node -c data-v2.js', {stdio:'inherit'});
console.log('✅ Syntax OK');

// Stats
let emptyDesc=0, emptyStart=0, emptyEnd=0, emptyPlace=0, totalSteps=0;
let hasBookingCost=0, totalBookings=0;
PLANS_V2.forEach(p => {
  p.days.forEach(d => {
    d.steps.forEach(s => {
      totalSteps++;
      if(!s.description && s.type !== 'home') emptyDesc++;
      if(!s.startTime) emptyStart++;
      if(!s.endTime && s.type !== 'home') emptyEnd++;
      if(!s.place?.name && s.type !== 'home') emptyPlace++;
      if(s.bookings) {
        s.bookings.forEach(b => { totalBookings++; if(b.cost) hasBookingCost++; });
      }
    });
  });
});
console.log(`Steps: ${totalSteps}`);
console.log(`Missing desc: ${emptyDesc} (${Math.round(emptyDesc/totalSteps*100)}%)`);
console.log(`Missing startTime: ${emptyStart}`);
console.log(`Missing endTime: ${emptyEnd}`);
console.log(`Missing place: ${emptyPlace}`);
console.log(`Bookings: ${totalBookings}, with cost: ${hasBookingCost} (${Math.round(hasBookingCost/totalBookings*100)}%)`);
console.log(`Card fields: legs=${PLANS_V2.filter(p=>p.legs?.length).length}/17, stayType=${PLANS_V2.filter(p=>p.stayType).length}/17, price.total=${PLANS_V2.filter(p=>p.price?.total).length}/17`);
