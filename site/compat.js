// Compatibility adapter: convert new clean schema back to old format
// so the original app.js UI works unchanged

// Derive old-format fields from steps
PLANS.forEach((plan, idx) => {
  const allSteps = plan.days.flatMap(d => d.steps);
  
  // plan.id: old used numeric, new uses string
  plan._origId = plan.id;
  plan.id = idx + 1;
  
  // plan.duration
  plan.duration = plan.days.length <= 1
    ? (allSteps.some(s => s.type === 'stay') ? '1天' : '半天')
    : plan.days.length + '天';
  
  // plan.category — already exists
  
  // plan.transit label
  const firstTransit = allSteps.find(s => s.type === 'transit');
  if (firstTransit) {
    const mode = firstTransit.text.match(/高铁|自驾|地铁|公交|打车|骑行|步行/)?.[0] || '交通';
    const mins = _timeDiff(firstTransit.startTime, firstTransit.endTime);
    const dur = mins >= 60 ? `${(mins/60).toFixed(1).replace(/\.0$/,'')}h` : `${mins}min`;
    const dest = (firstTransit.place?.name || '').replace(/站$/, '');
    plan.transit = `${mode}${dur} · ${dest}`;
  } else {
    plan.transit = '';
  }
  
  // plan.stayType + plan.price
  const stayStep = allSteps.find(s => s.type === 'stay');
  plan.stayType = stayStep ? (stayStep.text.match(/民宿|客栈|酒店|农家乐|茶宿/)?.[0] || '住宿') : '当天往返';
  plan.price = stayStep?.bookings?.find(b => b.type === 'hotel')?.cost || '免费';
  
  // plan.legs
  plan.legs = allSteps.filter(s => s.type === 'transit').map(s => {
    const icon = s.text.includes('高铁') ? '🚄' : s.text.includes('地铁') ? '🚇' : '🚗';
    const mins = _timeDiff(s.startTime, s.endTime);
    const dur = mins >= 60 ? `${(mins/60).toFixed(1).replace(/\.0$/,'')}h` : `${mins}min`;
    return `${icon}${dur}`;
  });
  
  // plan.days[].label
  plan.days.forEach((day, i) => {
    if (!day.label) {
      day.label = plan.days.length > 1 ? `Day${i+1}` : '';
    }
  });
  
  // plan.detail (old format)
  plan.detail = {
    fullItinerary: plan.days.map((day, i) => ({
      label: plan.days.length > 1 ? `Day ${i+1}` : (i === 0 ? '上午' : '下午'),
      content: day.steps.map(s => s.text).join('→')
    })),
    transitInfo: allSteps.filter(s => s.type === 'transit').map(s => {
      const cost = s.bookings?.find(b => b.cost)?.cost || '';
      return `${s.text}${cost ? ' ' + cost : ''}`;
    }),
    accommodation: stayStep ? `${stayStep.description || stayStep.text}${stayStep.bookings?.find(b=>b.cost)?.cost ? '，' + stayStep.bookings.find(b=>b.cost).cost : ''}` : '当天往返'
  };
});

// Build TIMELINES from steps
var TIMELINES = {};
PLANS.forEach(plan => {
  const segs = [];
  let hourOffset = 0;
  plan.days.forEach((day, dayIdx) => {
    day.steps.forEach(step => {
      const start = hourOffset + _timeToHours(step.startTime);
      const end = hourOffset + _timeToHours(step.endTime || step.startTime);
      const dur = Math.max(end - start, 0.1);
      let type = 'play';
      if (step.type === 'transit' || step.type === 'depart') type = 'travel';
      else if (step.type === 'stay') type = 'sleep';
      const cost = step.bookings?.find(b => b.cost)?.cost || '';
      segs.push({ type, label: step.text.substring(0, 20), start, end, cost });
    });
    // Add implicit sleep between days
    if (dayIdx < plan.days.length - 1) {
      const lastStep = day.steps[day.steps.length - 1];
      const lastEnd = hourOffset + _timeToHours(lastStep?.endTime || '22:00');
      const nextStart = hourOffset + 24; // next day
      if (lastEnd < nextStart) {
        segs.push({ type: 'sleep', label: '住宿', start: lastEnd, end: nextStart, cost: '' });
      }
      hourOffset += 24;
    }
  });
  // Normalize: make start from 0
  if (segs.length) {
    const base = segs[0].start;
    segs.forEach(s => { s.start -= base; s.end -= base; });
  }
  TIMELINES[plan.id] = segs;
});

// Build PLAN_TIPS from steps
var PLAN_TIPS = {};
PLANS.forEach(plan => {
  const tips = plan.days.flatMap(d => d.steps.flatMap(s => s.tips || []));
  if (tips.length) PLAN_TIPS[plan.id] = tips;
});

// Build RELATED_CONTENT from plan + steps
var RELATED_CONTENT = {};
PLANS.forEach(plan => {
  const content = [
    ...(plan.relatedContent || []),
    ...plan.days.flatMap(d => d.steps.flatMap(s => s.relatedContent || []))
  ];
  // Dedupe by title
  const seen = new Set();
  const unique = content.filter(c => { if (seen.has(c.title)) return false; seen.add(c.title); return true; });
  if (unique.length) RELATED_CONTENT[plan.id] = unique;
});

// Build STEP_DETAILS from steps
var STEP_DETAILS = {};
PLANS.forEach(plan => {
  plan.days.forEach(day => {
    day.steps.forEach(step => {
      if (step.description && step.place?.name) {
        STEP_DETAILS[step.place.name] = {
          desc: step.description,
          duration: step.startTime && step.endTime ? _formatDuration(_timeDiff(step.startTime, step.endTime)) : '',
          cost: step.bookings?.find(b => b.cost)?.cost || ''
        };
      }
    });
  });
});

// Helper functions
function _timeDiff(a, b) {
  if (!a || !b) return 30;
  const [h1,m1] = a.split(':').map(Number);
  const [h2,m2] = b.split(':').map(Number);
  return Math.max((h2*60+m2) - (h1*60+m1), 1);
}
function _timeToHours(t) {
  if (!t) return 8;
  const [h,m] = t.split(':').map(Number);
  return h + m/60;
}
function _formatDuration(mins) {
  if (mins >= 60) return `${(mins/60).toFixed(1).replace(/\.0$/,'')}h`;
  return `${mins}min`;
}
