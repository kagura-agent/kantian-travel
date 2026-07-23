// Convert data-v2.js to final clean schema
// Only store what's needed, derive the rest

const fs = require('fs');

// Load v2 data
const v2code = fs.readFileSync('data-v2.js', 'utf8');
const fn = new Function(v2code + '; return {PLANS_V2, RELATED_CONTENT_V2};');
const {PLANS_V2, RELATED_CONTENT_V2} = fn();

const PLANS_FINAL = PLANS_V2.map(p => {
  // Clean plan-level: only store non-derivable fields
  const plan = {
    id: p.id,
    title: p.title,
    origin: p.origin || '苏州',
    category: p.category,
    route: p.route,
    relatedContent: RELATED_CONTENT_V2[String(p.id)] || p.relatedContent || [],
    days: p.days.map(d => ({
      photo: d.photo,
      activity: d.activity,
      weather: d.weather,  // dynamic in production, mock for now
      steps: d.steps.map(s => {
        const step = { text: s.text, type: s.type };
        if (s.startTime) step.startTime = s.startTime;
        if (s.endTime) step.endTime = s.endTime;
        if (s.place?.name) step.place = { name: s.place.name };
        if (s.place?.lat) { step.place.lat = s.place.lat; step.place.lng = s.place.lng; }
        if (s.description) step.description = s.description;
        if (s.bookings?.length) step.bookings = s.bookings.map(b => {
          const bi = { type: b.type, label: b.label };
          if (b.cost) bi.cost = b.cost;
          if (b.url) bi.url = b.url;
          return bi;
        });
        if (s.tips?.length) step.tips = s.tips;
        if (s.relatedContent?.length) step.relatedContent = s.relatedContent;
        return step;
      })
    }))
  };
  return plan;
});

// === Derive helpers (prove we can compute everything cards need) ===
function deriveCardData(plan) {
  const allSteps = plan.days.flatMap(d => d.steps);
  
  // Duration
  const duration = plan.days.length === 1 
    ? (allSteps.some(s => s.type === 'stay') ? '1天' : '半天')
    : plan.days.length + '天';
  
  // Transit summary: first transit step
  const firstTransit = allSteps.find(s => s.type === 'transit');
  let transitSummary = '';
  if (firstTransit) {
    const mode = firstTransit.text.match(/高铁|自驾|地铁|公交|打车|骑行/)?.[0] || '交通';
    const dur = firstTransit.startTime && firstTransit.endTime ? (() => {
      const [h1,m1] = firstTransit.startTime.split(':').map(Number);
      const [h2,m2] = firstTransit.endTime.split(':').map(Number);
      const mins = (h2*60+m2) - (h1*60+m1);
      return mins >= 60 ? `${(mins/60).toFixed(1)}h` : `${mins}min`;
    })() : '';
    const dest = firstTransit.place?.name?.replace(/站$/, '') || '';
    transitSummary = `${mode}${dur} · ${dest}`;
  }
  
  // Stay type + price
  const stayStep = allSteps.find(s => s.type === 'stay');
  const stayType = stayStep ? (stayStep.text.match(/民宿|客栈|酒店|农家乐|茶宿/)?.[0] || '住宿') : '当天往返';
  const stayPrice = stayStep?.bookings?.find(b => b.type === 'hotel')?.cost || '';
  
  // Legs for map
  const transitSteps = allSteps.filter(s => s.type === 'transit');
  const legs = transitSteps.map(s => {
    const mode = s.text.match(/🚄|🚗|🚇|🚌|🚲/)?.[0] || 
                 (s.text.includes('高铁') ? '🚄' : s.text.includes('自驾') || s.text.includes('打车') ? '🚗' : '🚗');
    const dur = s.startTime && s.endTime ? (() => {
      const [h1,m1] = s.startTime.split(':').map(Number);
      const [h2,m2] = s.endTime.split(':').map(Number);
      const mins = (h2*60+m2) - (h1*60+m1);
      return mins >= 60 ? `${Math.round(mins/60*10)/10}h` : `${mins}min`;
    })() : '';
    return `${mode}${dur}`;
  });

  // Total price estimate
  const allCosts = allSteps.flatMap(s => (s.bookings || []).map(b => b.cost)).filter(Boolean);
  
  return { duration, transitSummary, stayType, stayPrice, legs, allCosts };
}

// Write output
let output = '// data-final.js — Clean schema, zero redundancy\n';
output += '// Card-level display fields are computed from steps at render time\n\n';
output += 'const PLANS = ' + JSON.stringify(PLANS_FINAL, null, 2) + ';\n';
fs.writeFileSync('data-final.js', output);

// Verify syntax
require('child_process').execSync('node -c data-final.js', {stdio:'inherit'});

// Verify derivation covers all cards
console.log('✅ Syntax OK\n');
console.log('=== Card derivation check ===');
PLANS_FINAL.forEach(p => {
  const d = deriveCardData(p);
  const stepCount = p.days.flatMap(d => d.steps).length;
  const descCount = p.days.flatMap(d => d.steps).filter(s => s.description).length;
  const bookCount = p.days.flatMap(d => d.steps).flatMap(s => s.bookings || []).length;
  console.log(`${p.title}`);
  console.log(`  ${d.duration} | ${d.transitSummary} | ${d.stayType} ${d.stayPrice}`);
  console.log(`  legs: [${d.legs.join(', ')}]`);
  console.log(`  steps: ${stepCount} | with desc: ${descCount} | bookings: ${bookCount}`);
  console.log(`  costs: ${d.allCosts.join(', ') || '(none)'}`);
  console.log('');
});

const totalSize = fs.statSync('data-final.js').size;
console.log(`File size: ${(totalSize/1024).toFixed(1)}KB`);
