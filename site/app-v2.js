// === State ===
let savedIds = new Set();
let currentFilter = 'tomorrow';

// === Helpers: derive card fields from steps ===
function derivePlan(plan) {
  const allSteps = plan.days.flatMap(d => d.steps);
  const duration = plan.days.length <= 1
    ? (allSteps.some(s => s.type === 'stay') ? '1天' : '半天')
    : plan.days.length + '天';
  const firstTransit = allSteps.find(s => s.type === 'transit');
  let transitLabel = '';
  if (firstTransit) {
    const mode = firstTransit.text.match(/高铁|自驾|地铁|公交|打车|骑行|步行/)?.[0] || '交通';
    const mins = timeDiffMin(firstTransit.startTime, firstTransit.endTime);
    const durStr = mins >= 60 ? `${(mins/60).toFixed(1).replace(/\.0$/,'')}h` : `${mins}min`;
    const dest = (firstTransit.place?.name || '').replace(/站$/, '');
    transitLabel = `${mode}${durStr} · ${dest}`;
  }
  const stayStep = allSteps.find(s => s.type === 'stay');
  const stayType = stayStep ? (stayStep.text.match(/民宿|客栈|酒店|农家乐|茶宿/)?.[0] || '住宿') : '当天往返';
  const stayPrice = stayStep?.bookings?.find(b => b.type === 'hotel')?.cost || '';
  const legs = allSteps.filter(s => s.type === 'transit').map(s => {
    const icon = s.text.includes('高铁') ? '🚄' : s.text.includes('地铁') ? '🚇' : '🚗';
    const mins = timeDiffMin(s.startTime, s.endTime);
    const dur = mins >= 60 ? `${(mins/60).toFixed(1).replace(/\.0$/,'')}h` : `${mins}min`;
    return `${icon}${dur}`;
  });
  return { duration, transitLabel, stayType, stayPrice, legs };
}


function timeDiffMin(a, b) {
  if (!a || !b) return 30;
  const [h1,m1] = a.split(':').map(Number);
  const [h2,m2] = b.split(':').map(Number);
  return Math.max((h2*60+m2) - (h1*60+m1), 1);
}

// Extract map route points from steps (only steps with coordinates)
function getRoutePoints(plan) {
  const points = [];
  const seen = new Set();
  plan.days.forEach(d => d.steps.forEach(s => {
    if (s.place?.lat && s.place?.lng) {
      const key = `${s.place.lat},${s.place.lng}`;
      if (!seen.has(key)) {
        seen.add(key);
        points.push(s.place);
      }
    }
  }));
  return points;
}

// Extract map points for a specific day
function getDayRoutePoints(plan, dayIdx) {
  const points = [];
  const seen = new Set();
  plan.days[dayIdx].steps.forEach(s => {
    if (s.place?.lat && s.place?.lng) {
      const key = `${s.place.lat},${s.place.lng}`;
      if (!seen.has(key)) {
        seen.add(key);
        points.push(s.place);
      }
    }
  });
  return points;
}

// === Route Map Overlay SVG ===
function routeOverlaySVG(route, totalH) {
  if (!route || route.length < 2) return '';
  const lats = route.map(p => p.lat), lngs = route.map(p => p.lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const latRange = maxLat - minLat || 0.1, lngRange = maxLng - minLng || 0.1;
  const W = 80, H = totalH, pad = 16;
  const points = route.map(p => ({
    x: pad + ((p.lng - minLng) / lngRange) * (W - pad * 2),
    y: pad + ((maxLat - p.lat) / latRange) * (H - pad * 2),
    name: p.name
  }));
  let svg = `<svg class="route-overlay" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">`;
  const linePts = points.map(p => `${p.x},${p.y}`).join(' ');
  svg += `<polyline points="${linePts}" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" stroke-dasharray="4,3" stroke-linecap="round"/>`;
  points.forEach(p => {
    svg += `<circle cx="${p.x}" cy="${p.y}" r="2.5" fill="#fff" opacity="0.9"/>`;
  });
  svg += '</svg>';
  return svg;
}

// === Weather Chart SVG ===
function weatherOverlaySVG(days) {
  const n = days.length;
  const temps = days.map(d => parseInt(d.weather.temp));
  const minT = Math.min(...temps) - 2;
  const maxT = Math.max(...temps) + 2;
  const range = maxT - minT || 1;
  const stripH = 120;
  const W = 70;
  const H = n * stripH;
  let svg = `<svg class="weather-overlay" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">`;
  const points = days.map((d, i) => {
    const y = (i * stripH) + (stripH / 2);
    const x = 10 + ((parseInt(d.weather.temp) - minT) / range) * 30;
    return { x, y, ...d.weather };
  });
  if (n > 1) {
    const linePts = points.map(p => `${p.x},${p.y}`).join(' ');
    svg += `<polyline points="${linePts}" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  points.forEach(p => {
    svg += `<circle cx="${p.x}" cy="${p.y}" r="3.5" fill="#fff" stroke="#FF6B4A" stroke-width="1.5"/>`;
    svg += `<text x="${p.x + 7}" y="${p.y + 4}" font-size="10" fill="#fff" font-weight="600" style="text-shadow:0 1px 3px rgba(0,0,0,.9)">${p.icon}${p.temp}</text>`;
  });
  svg += '</svg>';
  return svg;
}

// === DOM Refs ===
const cardList = document.getElementById('cardList');
const detailOverlay = document.getElementById('detailOverlay');
const detailSheet = document.getElementById('detailSheet');
const detailBody = document.getElementById('detailBody');
const detailClose = document.getElementById('detailClose');
const shortlistBtn = document.getElementById('shortlistBtn');
const shortlistBadge = document.getElementById('shortlistBadge');
const shortlistOverlay = document.getElementById('shortlistOverlay');
const shortlistClose = document.getElementById('shortlistClose');
const shortlistBody = document.getElementById('shortlistBody');
const timeTabs = document.getElementById('timeTabs');

// === Filter ===
const filterMap = {
  'now': ['now'],
  'tomorrow': ['tomorrow'],
  'weekend': ['weekend'],
  'next-weekend': ['weekend'],
  '3day': ['3day'],
  '5day': ['5day'],
  'week': ['week']
};

// === Image URL ===
function imgUrl(id) {
  if (id.startsWith('http')) return id;
  return `https://images.unsplash.com/${id}?w=800&h=500&fit=crop`;
}

// === Render Cards ===
function renderCards() {
  const categories = filterMap[currentFilter];
  const filtered = PLANS.filter(p => categories.includes(p.category));
  cardList.innerHTML = '';
  if (filtered.length === 0) {
    cardList.innerHTML = '<div class="empty-state"><p>这个时间段暂无推荐</p><p class="empty-sub">换个时间看看？</p></div>';
    return;
  }
  filtered.forEach((plan, idx) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.animationDelay = `${idx * 0.08}s`;
    const d = derivePlan(plan);
    const isSaved = savedIds.has(plan.id);
    const stripH = 120;
    const totalPhotoH = plan.days.length * stripH;
    const photoStack = plan.days.map((day, i) => `
      <div class="day-strip">
        <img class="day-photo" data-src="${imgUrl(day.photo)}" alt="${day.activity}" loading="lazy">
        <div class="day-overlay">
          ${plan.days.length > 1 ? `<span class="day-label">Day${i+1}</span>` : ''}
          <span class="day-activity">${day.activity}</span>
        </div>
      </div>
    `).join('');
    // Compute total cost from bookings
    const allBookings = plan.days.flatMap(dy => dy.steps.flatMap(s => s.bookings || []));
    const totalCost = allBookings.reduce((a, b) => {
      const m = (b.cost || '').match(/(\d+)/); return a + (m ? parseInt(m[1]) : 0);
    }, 0);
    const priceLabel = totalCost > 0 ? `约¥${totalCost}/人` : `${d.stayType} ${d.stayPrice}`;
    card.innerHTML = `
      <div class="card-photos" data-days="${plan.days.length}">
        ${photoStack}
        ${weatherOverlaySVG(plan.days)}
        <button class="card-heart ${isSaved ? 'saved' : ''}" data-id="${plan.id}">
          <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <span class="card-duration">${d.duration}</span>
      </div>
      <div class="card-info">
        <h3 class="card-title">${plan.title}</h3>
        <div class="card-meta">
          <span class="card-transit">${d.transitLabel}</span>
          <span class="card-price">${priceLabel}</span>
        </div>
        ${getRoutePoints(plan).length >= 2 ? `<div class="card-timeline" id="timeline-${plan.id}"></div>` : ''}
      </div>
    `;
    card.addEventListener('click', (e) => { if (e.target.closest('.card-heart')) return; openDetail(plan); });
    const heartBtn = card.querySelector('.card-heart');
    heartBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleSave(plan.id, heartBtn); });
    cardList.appendChild(card);
  });
  lazyLoadImages();
  initTimelines(filtered);
}

// === Timeline Gantt Bar (from steps) ===
function initTimelines(plans) {
  const colors = { travel: '#BBBBC0', play: '#34C759', sleep: '#5856D6' };
  plans.forEach(plan => {
    const el = document.getElementById(`timeline-${plan.id}`);
    if (!el) return;
    // Build timeline segments from steps
    const segs = [];
    let hourOffset = 0;
    plan.days.forEach((day, dayIdx) => {
      day.steps.forEach(step => {
        const start = hourOffset + _timeToHours(step.startTime);
        const end = hourOffset + _timeToHours(step.endTime || step.startTime);
        let type = 'play';
        if (step.type === 'transit' || step.type === 'depart') type = 'travel';
        else if (step.type === 'stay') type = 'sleep';
        const cost = step.bookings?.find(b => b.cost)?.cost || '';
        segs.push({ type, label: step.text.substring(0, 20), start, end, cost });
      });
      if (dayIdx < plan.days.length - 1) {
        const lastStep = day.steps[day.steps.length - 1];
        const lastEnd = hourOffset + _timeToHours(lastStep?.endTime || '22:00');
        segs.push({ type: 'sleep', label: '住宿', start: lastEnd, end: hourOffset + 24, cost: '' });
        hourOffset += 24;
      }
    });
    if (!segs.length) return;
    const base = segs[0].start;
    segs.forEach(s => { s.start -= base; s.end -= base; });
    const totalH = segs[segs.length - 1].end;
    if (totalH <= 0) return;
    let html = '<div class="tl-bar">';
    segs.forEach(seg => {
      const pct = ((seg.end - seg.start) / totalH * 100).toFixed(1);
      const costLabel = (seg.type === 'travel' || seg.type === 'sleep') && seg.cost && !/免费|当天/.test(seg.cost) ? `<span class="tl-cost">${seg.cost}</span>` : '';
      html += `<div class="tl-seg" style="width:${pct}%;background:${colors[seg.type]}" title="${seg.label}">${costLabel}</div>`;
    });
    html += '</div>';
    const travelH = segs.filter(s=>s.type==='travel').reduce((a,s)=>a+(s.end-s.start),0);
    const playH = segs.filter(s=>s.type==='play').reduce((a,s)=>a+(s.end-s.start),0);
    const sleepH = segs.filter(s=>s.type==='sleep').reduce((a,s)=>a+(s.end-s.start),0);
    html += '<div class="tl-legend">';
    html += `<span><i style="background:#34C759"></i>玩 ${playH.toFixed(1)}h (${(playH/totalH*100).toFixed(0)}%)</span>`;
    html += `<span><i style="background:#BBBBC0"></i>路上 ${travelH.toFixed(1)}h (${(travelH/totalH*100).toFixed(0)}%)</span>`;
    if (sleepH > 0) html += `<span><i style="background:#5856D6"></i>住 ${sleepH.toFixed(0)}h (${(sleepH/totalH*100).toFixed(0)}%)</span>`;
    html += '</div>';
    el.innerHTML = html;
  });
}
function _timeToHours(t) { if (!t) return 8; const [h,m] = t.split(':').map(Number); return h + m/60; }

// === Init Card Maps ===

// === Lazy Load ===
function lazyLoadImages() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const img = e.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          delete img.dataset.src;
          img.onload = () => img.classList.add('loaded');
        }
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '300px' });
  document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
}

// === Save/Shortlist ===
function toggleSave(id, btn) {
  if (savedIds.has(id)) { savedIds.delete(id); btn.classList.remove('saved'); }
  else { savedIds.add(id); btn.classList.add('saved'); }
  updateBadge();
}
function updateBadge() {
  shortlistBadge.textContent = savedIds.size || '';
  shortlistBadge.style.display = savedIds.size ? 'flex' : 'none';
}

// === Hourly Chart ===
function buildHourlyChart(day) {
  const baseTemp = parseInt(day.weather.temp);
  const hours = [
    {h:'6', t:baseTemp-4, icon:'🌤️'}, {h:'9', t:baseTemp-2, icon:day.weather.icon},
    {h:'12', t:baseTemp, icon:day.weather.icon}, {h:'15', t:baseTemp+1, icon:day.weather.icon},
    {h:'18', t:baseTemp-1, icon:day.weather.icon}, {h:'21', t:baseTemp-3, icon:'🌙'}
  ];
  const temps = hours.map(h => h.t);
  const minT = Math.min(...temps) - 1, maxT = Math.max(...temps) + 1;
  const range = maxT - minT || 1;
  const W = 300, H = 60, padX = 25, padY = 10, chartH = H - padY * 2;
  const points = hours.map((h, i) => ({
    x: padX + (i / (hours.length - 1)) * (W - padX * 2),
    y: padY + (1 - (h.t - minT) / range) * chartH, ...h
  }));
  let svg = `<svg class="hourly-chart" viewBox="0 0 ${W} ${H}">`;
  svg += `<polyline points="${points.map(p => `${p.x},${p.y}`).join(' ')}" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  points.forEach(p => {
    svg += `<circle cx="${p.x}" cy="${p.y}" r="3" fill="#fff"/>`;
    svg += `<text x="${p.x}" y="${p.y - 8}" text-anchor="middle" font-size="9" fill="#fff" font-weight="600" style="text-shadow:0 1px 3px rgba(0,0,0,.8)">${p.icon}${p.t}°</text>`;
    svg += `<text x="${p.x}" y="${H - 2}" text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.8)" style="text-shadow:0 1px 2px rgba(0,0,0,.8)">${p.h}:00</text>`;
  });
  svg += '</svg>';
  return svg;
}

// === Step type colors ===
const TYPE_COLORS = { depart:'#4A90D9', transit:'#BBBBC0', play:'#34C759', eat:'#34C759', stay:'#5856D6', home:'#FF9800' };
const TYPE_LABELS = { depart:'出发', transit:'路上', play:'玩', eat:'吃', stay:'住', home:'到家' };
const TYPE_ICONS = { depart:'🚶', transit:'🚗', play:'📍', eat:'🍽️', stay:'🏠', home:'🏠' };

// === Detail View ===
function openDetail(plan) {
  const numDays = plan.days.length;
  const d = derivePlan(plan);

  // Compute day dates
  const weekday = ['周日','周一','周二','周三','周四','周五','周六'];
  const now = new Date();
  let start = new Date(now);
  if (currentFilter === 'now') start = now;
  else if (currentFilter === 'tomorrow') start.setDate(now.getDate() + 1);
  else if (currentFilter === 'weekend') { const dw = now.getDay(); start.setDate(now.getDate() + (dw === 0 ? 0 : 6 - dw)); }
  else if (currentFilter === 'next-weekend') { const dw = now.getDay(); start.setDate(now.getDate() + (dw === 0 ? 7 : 13 - dw)); }
  else start.setDate(now.getDate() + 1);
  const dayDates = plan.days.map((_, i) => {
    const dt = new Date(start); dt.setDate(start.getDate() + i);
    return `${dt.getMonth()+1}/${dt.getDate()} ${weekday[dt.getDay()]}`;
  });

  // === Build Overview ===
  function buildOverviewHTML() {
    const allSteps = plan.days.flatMap(d => d.steps);
    const allTips = allSteps.flatMap(s => s.tips || []);
    const transitSteps = allSteps.filter(s => s.type === 'transit');
    const staySteps = allSteps.filter(s => s.type === 'stay');
    const allContent = [
      ...(plan.relatedContent || []),
      ...allSteps.flatMap(s => s.relatedContent || [])
    ];
    const seenTitles = new Set();
    const uniqueContent = allContent.filter(c => { if (seenTitles.has(c.title)) return false; seenTitles.add(c.title); return true; });
    const allBookings = allSteps.flatMap(s => s.bookings || []);
    const uniqueBookings = [...new Map(allBookings.map(b => [b.label, b])).values()];

    // Build timeline bar from steps
    function buildOverviewTimeline() {
      const segs = [];
      let hourOffset = 0;
      plan.days.forEach((day, dayIdx) => {
        day.steps.forEach(step => {
          const start = hourOffset + _timeToHours(step.startTime);
          const end = hourOffset + _timeToHours(step.endTime || step.startTime);
          let type = 'play';
          if (step.type === 'transit' || step.type === 'depart') type = 'travel';
          else if (step.type === 'stay') type = 'sleep';
          const cost = step.bookings?.find(b => b.cost)?.cost || '';
          segs.push({ type, label: step.text.substring(0, 20), start, end, cost });
        });
        if (dayIdx < plan.days.length - 1) {
          const lastStep = day.steps[day.steps.length - 1];
          const lastEnd = hourOffset + _timeToHours(lastStep?.endTime || '22:00');
          segs.push({ type: 'sleep', label: '住宿', start: lastEnd, end: hourOffset + 24, cost: '' });
          hourOffset += 24;
        }
      });
      if (!segs.length) return '';
      const base = segs[0].start;
      segs.forEach(s => { s.start -= base; s.end -= base; });
      const totalH = segs[segs.length - 1].end;
      if (totalH <= 0) return '';
      const colors = { travel: '#BBBBC0', play: '#34C759', sleep: '#5856D6' };
      let html = '<div class="detail-section"><h4 class="detail-section-title">时间分配</h4><div class="tl-bar">';
      segs.forEach(seg => {
        const pct = ((seg.end - seg.start) / totalH * 100).toFixed(1);
        const costLabel = (seg.type === 'travel' || seg.type === 'sleep') && seg.cost && !/免费|当天/.test(seg.cost) ? `<span class="tl-cost">${seg.cost}</span>` : '';
        html += `<div class="tl-seg" style="width:${pct}%;background:${colors[seg.type]}" title="${seg.label}">${costLabel}</div>`;
      });
      html += '</div>';
      const travelH = segs.filter(s=>s.type==='travel').reduce((a,s)=>a+(s.end-s.start),0);
      const playH = segs.filter(s=>s.type==='play').reduce((a,s)=>a+(s.end-s.start),0);
      const sleepH = segs.filter(s=>s.type==='sleep').reduce((a,s)=>a+(s.end-s.start),0);
      html += '<div class="tl-legend">';
      html += `<span><i style="background:#34C759"></i>玩 ${playH.toFixed(1)}h (${(playH/totalH*100).toFixed(0)}%)</span>`;
      html += `<span><i style="background:#BBBBC0"></i>路上 ${travelH.toFixed(1)}h (${(travelH/totalH*100).toFixed(0)}%)</span>`;
      if (sleepH > 0) html += `<span><i style="background:#5856D6"></i>住 ${sleepH.toFixed(0)}h (${(sleepH/totalH*100).toFixed(0)}%)</span>`;
      html += '</div></div>';
      return html;
    }

    return `
      <div class="detail-photo-weather">
        <div class="detail-hero-photo">
          <img src="${imgUrl(plan.days[0].photo)}" alt="${plan.title}">
          <div class="hero-activity">${plan.days.map(dy => dy.weather.icon).join(' ')} ${d.duration}</div>
        </div>
      </div>

      ${buildOverviewTimeline()}

      ${getRoutePoints(plan).length >= 2 ? '<div class="detail-section"><h4 class="detail-section-title">路线地图</h4><div id="routeMap" class="route-map"></div><div id="mapLayerToggles" class="map-layer-toggles"></div></div>' : ''}

      <div class="detail-section">
        <h4 class="detail-section-title">行程概览</h4>
        ${plan.days.map((day, i) => `
          <div class="detail-itin-day">
            <span class="di-label">${dayDates[i]}</span>
            <p class="di-content">${day.steps.map(s => s.text).join(' → ')}</p>
          </div>
        `).join('')}
      </div>

      <div class="detail-section">
        <h4 class="detail-section-title">交通信息</h4>
        <div class="detail-transit-info">
          ${transitSteps.map(s => {
            const cost = s.bookings?.find(b => b.cost)?.cost || '';
            return `<p class="dt-row">${s.text}${cost ? ' ' + cost : ''}</p>`;
          }).join('')}
        </div>
      </div>

      <div class="detail-section">
        <h4 class="detail-section-title">住宿</h4>
        <p class="detail-stay">${staySteps.map(s => {
          const cost = s.bookings?.find(b => b.cost)?.cost || '';
          return `${s.description || s.text}${cost ? '，' + cost : ''}`;
        }).join('。') || '当天往返。'}</p>
      </div>

      ${allTips.length ? `
      <div class="detail-section">
        <h4 class="detail-section-title">小贴士</h4>
        <div class="detail-tips">
          ${allTips.map(t => `<div class="tip-item">💡 ${t}</div>`).join('')}
        </div>
      </div>` : ''}

      <div class="detail-section">
        <h4 class="detail-section-title">种草内容</h4>
        <div class="related-content">
          ${uniqueContent.map(c => `
            <div class="related-card" style="border-left:3px solid ${c.color || '#FF6B4A'}">
              <div class="rc-header">
                <span class="rc-platform">${c.icon} ${c.platform}</span>
                <span class="rc-likes">❤️ ${c.likes}</span>
              </div>
              <p class="rc-title">${c.title}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="detail-section">
        <h4 class="detail-section-title">预订</h4>
        <div class="detail-booking-pills">
          ${uniqueBookings.map(b => `<span class="booking-pill">${b.label} ${b.cost || ''} →</span>`).join('')}
        </div>
      </div>
    `;
  }

  // === Build Day View ===
  function buildDayHTML(dayIdx) {
    const day = plan.days[dayIdx];
    const steps = day.steps;
    // Compute durations for proportional timeline
    const durations = steps.map((s, i) => {
      if (i >= steps.length - 1) return 10;
      return Math.max(timeDiffMin(s.startTime, steps[i+1].startTime), 5);
    });
    const maxDur = Math.max(...durations, 1);
    const minLineH = 16, maxLineH = 80;

    let stepsHTML = '<div class="day-steps-timeline">';
    steps.forEach((step, i) => {
      const color = TYPE_COLORS[step.type] || '#999';
      const typeLabel = TYPE_LABELS[step.type] || '';
      const icon = TYPE_ICONS[step.type] || '📍';
      const lineH = Math.round(minLineH + (durations[i] / maxDur) * (maxLineH - minLineH));
      const navUrl = step.place?.name ? `https://uri.amap.com/navigation?to=${encodeURIComponent(step.place.name)}&mode=car` : '';

      stepsHTML += `
        <div class="tl-step">
          <div class="tl-left">
            <span class="tl-time">${step.startTime || ''}</span>
            <div class="tl-dot" style="background:${color}"></div>
            ${i < steps.length - 1 ? `<div class="tl-line" style="background:${color};min-height:${lineH}px"></div>` : ''}
          </div>
          <div class="tl-right">
            <div class="tl-step-header">
              <span class="tl-type" style="color:${color}">${typeLabel}</span>
              <span class="tl-step-text">${step.text}</span>
            </div>
            ${step.type !== 'home' ? `<div class="tl-step-extras">
              ${step.description ? `<p class="step-desc">${step.description}</p>` : ''}
              <div class="step-actions">
                ${navUrl ? `<a class="step-action-btn" href="${navUrl}" target="_blank">📍 导航到${step.place.name}</a>` : ''}
                ${(step.bookings || []).map(b => `<span class="step-action-btn step-action-book">${b.label}${b.cost ? ' '+b.cost : ''}</span>`).join('')}
              </div>
              ${(step.relatedContent || []).map(c => `<a class="step-rec" href="#"><span class="sr-platform">${c.icon}</span><span class="sr-title">${c.title}</span><span class="sr-likes">❤️ ${c.likes}</span></a>`).join('')}
              ${(step.tips || []).map(t => `<div class="step-tip">💡 ${t}</div>`).join('')}
            </div>` : ''}
          </div>
        </div>
      `;
    });
    stepsHTML += '</div>';

    // Build preparation card for next day
    function buildPrepCard() {
      const isFirstDay = dayIdx === 0;
      const isLastDay = dayIdx === numDays - 1;
      const items = [];

      if (isFirstDay) {
        // "出发准备" — from today's steps
        const todaySteps = day.steps;
        if (todaySteps.some(s => s.type === 'transit' && /高铁|火车/.test(s.text))) items.push('带好身份证，提前购票');
        if (todaySteps.some(s => s.type === 'stay')) {
          const stay = todaySteps.find(s => s.type === 'stay');
          items.push('确认' + (stay?.place?.name || '住宿') + '预订');
        }
        todaySteps.forEach(s => (s.tips || []).forEach(t => items.push(t)));
        if (todaySteps.some(s => /徒步|爬山|登山|骑行/.test(s.text))) items.push('穿运动鞋，带水和防晒');
        if (todaySteps.some(s => /萤火虫|蚊/.test(s.text + (s.description || '')))) items.push('带驱蚊水');
      }

      if (!isLastDay) {
        // "明日准备" — from next day's steps
        const nextDay = plan.days[dayIdx + 1];
        const nextSteps = nextDay.steps;
        if (nextSteps.some(s => s.type === 'transit' && /高铁|火车/.test(s.text))) items.push('提前买好明天的车票');
        if (nextSteps.some(s => s.type === 'stay')) {
          const stay = nextSteps.find(s => s.type === 'stay');
          items.push('确认明天' + (stay?.place?.name || '住宿') + '预订');
        }
        if (nextSteps.some(s => /骑行|租车/.test(s.text))) items.push('明天有骑行，确认租车');
        if (nextSteps.some(s => s.bookings?.some(b => b.type === 'ticket'))) items.push('提前网上买好明天的门票');
        const nextStart = nextSteps[0]?.startTime;
        if (nextStart) {
          const [h] = nextStart.split(':').map(Number);
          if (h < 7) items.push('明天 ' + nextStart + ' 出发，早点睡！');
        }
        nextSteps.forEach(s => (s.tips || []).forEach(t => { if (!items.includes(t)) items.push(t); }));
        if (nextSteps.some(s => /徒步|爬山|登山/.test(s.text))) items.push('明天有徒步，穿运动鞋');
      }

      // Dedupe
      const unique = [...new Set(items)];
      if (!unique.length) return '';

      const title = isFirstDay && !isLastDay ? '出发准备' : isLastDay ? '' : '明日准备';
      if (!title) return '';
      return `
        <div class="detail-section prep-card">
          <h4 class="detail-section-title">📋 ${title}</h4>
          <div class="prep-items">
            ${unique.map(item => `<div class="prep-item">· ${item}</div>`).join('')}
          </div>
        </div>
      `;
    }

    return `
      <div class="detail-photo-weather">
        <div class="detail-hero-photo">
          <img src="${imgUrl(day.photo)}" alt="${day.activity}">
          <div class="hero-activity">${day.activity}</div>
          <div class="hero-hourly">${buildHourlyChart(day)}</div>
        </div>
      </div>
      ${stepsHTML}
      ${getDayRoutePoints(plan, dayIdx).length >= 2 ? '<div class="detail-section"><h4 class="detail-section-title">路线</h4><div id="dayRouteMap" class="route-map"></div></div>' : ''}
      ${buildPrepCard()}
    `;
  }

  // === Render Detail View ===
  function renderDetailView(mode) {
    const isOverview = mode === 'overview';
    const showOverview = numDays > 1;
    const viewTabsHTML = `
      <div class="view-tabs-row">
        ${showOverview ? `<button class="view-tab ${isOverview ? 'active' : ''}" data-mode="overview">全览</button>` : ''}
        ${plan.days.map((day, i) => `
          <button class="view-tab ${mode === i ? 'active' : ''}" data-mode="${i}">
            <span class="vt-day">${dayDates[i]}</span>
            <span class="vt-weather">${day.weather.icon}${day.weather.temp}</span>
          </button>
        `).join('')}
      </div>
    `;
    const contentHTML = isOverview ? buildOverviewHTML() : buildDayHTML(mode);
    detailBody.innerHTML = `
      <h2 class="detail-title">${plan.title}</h2>
      <p class="detail-transit">🚄 ${d.transitLabel} · ${d.stayType} ${d.stayPrice}</p>
      ${viewTabsHTML}
      <div id="detailContent">${contentHTML}</div>
      <div class="detail-cta">
        <button class="trip-start-btn" data-plan-id="${plan.id}">出发 🚶</button>
      </div>
    `;
    // Bind tabs
    detailBody.querySelectorAll('.view-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const m = tab.dataset.mode;
        renderDetailView(m === 'overview' ? 'overview' : parseInt(m));
        detailSheet.scrollTop = 0;
      });
    });
    // Render map
    if (isOverview) renderDetailMap(plan);
    else renderDayMap(plan, mode);
  }

  renderDetailView(numDays > 1 ? 'overview' : 0);
  detailOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// === Detail Map (Overview) with layer toggles ===
function renderDetailMap(plan) {
  const route = getRoutePoints(plan);
  if (route.length < 2 || !window.L) return;
  setTimeout(() => {
    const mapEl = document.getElementById('routeMap');
    if (!mapEl) return;
    try {
    // Categorize points by step type
    const pointsByType = { stay: [], play: [], transit: [] };
    const seen = new Set();
    plan.days.forEach(d => d.steps.forEach(s => {
      if (s.place?.lat && s.place?.lng) {
        const key = `${s.place.lat},${s.place.lng}`;
        if (!seen.has(key)) {
          seen.add(key);
          const cat = s.type === 'stay' ? 'stay' : (s.type === 'transit' || s.type === 'depart' || s.type === 'home') ? 'transit' : 'play';
          pointsByType[cat].push(s.place);
        }
      }
    }));

    const map = L.map(mapEl, { zoomControl: false, attributionControl: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', { maxZoom: 18 }).addTo(map);
    const pts = route.map(p => [p.lat, p.lng]);

    // Route line
    const coords = route.map(p => `${p.lng},${p.lat}`).join(';');
    fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`)
      .then(r => r.json()).then(data => {
        if (data.routes?.[0]) L.polyline(data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]), { color: '#FF6B4A', weight: 3, opacity: 0.85 }).addTo(map);
      }).catch(() => {});

    // Layer groups
    const colors = { stay: '#5856D6', play: '#34C759', transit: '#BBBBC0' };
    const layers = {};
    Object.entries(pointsByType).forEach(([type, points]) => {
      const group = L.layerGroup();
      points.forEach(p => {
        L.circleMarker([p.lat, p.lng], { radius: 5, fillColor: colors[type], color: '#fff', weight: 2, fillOpacity: 1 })
          .bindTooltip(p.name, { permanent: true, direction: 'top', offset: [0, -8], className: 'map-label-sm' })
          .addTo(group);
      });
      layers[type] = group;
    });

    // Default: show only stay
    if (layers.stay) layers.stay.addTo(map);

    map.fitBounds(pts, { padding: [35, 35] });

    // Render toggle buttons
    const toggleDiv = document.getElementById('mapLayerToggles');
    if (toggleDiv) {
      const btns = [
        { key: 'stay', label: '🏨 住宿', active: true },
        { key: 'play', label: '🎯 景点', active: false },
        { key: 'transit', label: '🚗 交通', active: false }
      ];
      toggleDiv.innerHTML = btns.map(b =>
        `<button class="map-layer-btn ${b.active ? 'active' : ''}" data-layer="${b.key}">${b.label}</button>`
      ).join('');
      toggleDiv.querySelectorAll('.map-layer-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const key = btn.dataset.layer;
          btn.classList.toggle('active');
          if (btn.classList.contains('active')) {
            layers[key]?.addTo(map);
          } else {
            layers[key] && map.removeLayer(layers[key]);
          }
        });
      });
    }
    } catch(e) { console.error("Detail map error:", e); }
  }, 300);
}

function renderDayMap(plan, dayIdx) {
  const route = getDayRoutePoints(plan, dayIdx);
  if (route.length < 2 || !window.L) return;
  setTimeout(() => {
    const mapEl = document.getElementById('dayRouteMap');
    if (!mapEl) return;
    try { const map = L.map(mapEl, { zoomControl: false, attributionControl: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', { maxZoom: 18 }).addTo(map);
    const coords = route.map(p => `${p.lng},${p.lat}`).join(';');
    fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`)
      .then(r => r.json()).then(data => {
        if (data.routes?.[0]) L.polyline(data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]), { color: '#FF6B4A', weight: 3, opacity: 0.85 }).addTo(map);
      }).catch(() => {});
    route.forEach((p, i) => {
      L.circleMarker([p.lat, p.lng], { radius: 5, fillColor: '#FF6B4A', color: '#fff', weight: 2, fillOpacity: 1 })
        .addTo(map).bindTooltip(p.name, { permanent: true, direction: ['top','right','left','bottom'][i % 4], offset: [0, -8], className: 'map-label-sm' });
    });
    map.fitBounds(route.map(p => [p.lat, p.lng]), { padding: [40, 40] }); } catch(e) { console.error("Day map error:", e); }
  }, 300);
}

function closeDetail() {
  detailOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

// === Shortlist ===
function openShortlist() {
  const saved = PLANS.filter(p => savedIds.has(p.id));
  const trips = getTrips();

  if (saved.length === 0 && trips.length === 0) {
    shortlistBody.innerHTML = '<p class="panel-empty">还没收藏方案<br>看看有没有心动的？</p>';
  } else {
    shortlistBody.innerHTML = saved.map(p => {
      const planTrips = trips.filter(t => t.planId === p.id);
      const tripsHTML = planTrips.map(t => {
        const d = new Date(t.createdAt);
        const dateStr = `${d.getMonth()+1}/${d.getDate()}`;
        const totalSteps = t.days.reduce((a, d) => a + d.steps.length, 0);
        const doneSteps = t.days.reduce((a, d) => a + d.steps.filter(s => s.done).length, 0);
        const pct = Math.round(doneSteps / totalSteps * 100);
        return `
          <div class="trip-item" data-trip-id="${t.id}">
            <span class="trip-date">🚶 ${dateStr} 出发</span>
            <span class="trip-pct">${pct}%</span>
          </div>
        `;
      }).join('');
      return `
        <div class="sl-plan-group">
          <div class="sl-item" data-id="${p.id}">
            <img class="sl-img" src="${imgUrl(p.days[0].photo)}" alt="${p.title}">
            <div class="sl-info"><h4>${p.title}</h4><p>${derivePlan(p).duration} · ${derivePlan(p).transitLabel}</p></div>
          </div>
          ${tripsHTML}
          <button class="trip-new-btn" data-plan-id="${p.id}">+ 再走一次</button>
        </div>
      `;
    }).join('');

    // Also show orphan trips (plan not saved but trip exists)
    const orphanTrips = trips.filter(t => !saved.find(p => p.id === t.planId));
    if (orphanTrips.length) {
      shortlistBody.innerHTML += orphanTrips.map(t => {
        const plan = PLANS.find(p => p.id === t.planId);
        if (!plan) return '';
        const d = new Date(t.createdAt);
        const dateStr = `${d.getMonth()+1}/${d.getDate()}`;
        const totalSteps = t.days.reduce((a, d) => a + d.steps.length, 0);
        const doneSteps = t.days.reduce((a, d) => a + d.steps.filter(s => s.done).length, 0);
        const pct = Math.round(doneSteps / totalSteps * 100);
        return `
          <div class="sl-plan-group">
            <div class="trip-item" data-trip-id="${t.id}">
              <span class="trip-date">🚶 ${plan.title} ${dateStr}</span>
              <span class="trip-pct">${pct}%</span>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  shortlistOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Bind plan click → detail
  shortlistBody.querySelectorAll('.sl-item').forEach(el => {
    el.addEventListener('click', () => {
      const plan = PLANS.find(p => String(p.id) === el.dataset.id);
      if (plan) { closeShortlist(); openDetail(plan); }
    });
  });
  // Bind trip click → trip view
  shortlistBody.querySelectorAll('.trip-item').forEach(el => {
    el.addEventListener('click', () => {
      closeShortlist();
      setTimeout(() => openTripView(el.dataset.tripId), 300);
    });
  });
  // Bind "再走一次" → create new trip
  shortlistBody.querySelectorAll('.trip-new-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const plan = PLANS.find(p => p.id === btn.dataset.planId);
      if (plan) {
        const trip = createTrip(plan);
        closeShortlist();
        setTimeout(() => openTripView(trip.id), 300);
      }
    });
  });
}
function closeShortlist() {
  shortlistOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

// === Events ===
timeTabs.addEventListener('click', (e) => {
  const tab = e.target.closest('.tab');
  if (!tab) return;
  timeTabs.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  currentFilter = tab.dataset.filter;
  renderCards();
});
detailClose.addEventListener('click', closeDetail);
detailOverlay.addEventListener('click', (e) => { if (e.target === detailOverlay) closeDetail(); });
shortlistBtn.addEventListener('click', openShortlist);
shortlistClose.addEventListener('click', closeShortlist);

// === Init ===
// (moved after TAG_LABELS/rebuildTabs definition below)

// === Settings Panel ===
const settingsOverlay = document.getElementById('settingsOverlay');
const settingsClose = document.getElementById('settingsClose');
const locationBtn = document.getElementById('locationBtn');

locationBtn.addEventListener('click', () => {
  settingsOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
});
settingsClose.addEventListener('click', () => {
  settingsOverlay.classList.remove('open');
  document.body.style.overflow = '';
});
settingsOverlay.addEventListener('click', (e) => {
  if (e.target === settingsOverlay) { settingsOverlay.classList.remove('open'); document.body.style.overflow = ''; }
});

// City switch
document.getElementById('cityOptions').addEventListener('click', (e) => {
  const btn = e.target.closest('.city-btn');
  if (!btn) return;
  document.querySelectorAll('.city-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelector('.loc-name').textContent = btn.dataset.city;
});

// Tag toggle — rebuild tab bar from all enabled tags
const TAG_LABELS = {
  now: '现在', tomorrow: '明天', weekend: '这周末', 'next-weekend': '下周末',
  '3day': '请3天假', '5day': '小长假5天', week: '找7天连晴'
};

function rebuildTabs() {
  const checked = [...document.querySelectorAll('.tag-options input:checked')].map(i => i.dataset.tag);
  timeTabs.innerHTML = checked.map(tag =>
    `<button class="tab ${tag === currentFilter ? 'active' : ''}" data-filter="${tag}">${TAG_LABELS[tag] || tag}</button>`
  ).join('');
  // If current filter was hidden, switch to first available
  if (!checked.includes(currentFilter) && checked.length > 0) {
    currentFilter = checked[0];
    const first = timeTabs.querySelector('.tab');
    if (first) first.classList.add('active');
    renderCards();
  }
}

document.querySelectorAll('.tag-options').forEach(group => {
  group.addEventListener('change', rebuildTabs);
});

// === Init (deferred) ===
rebuildTabs();
renderCards();

// === 跟着走 (Trip Instance) ===
function createTrip(plan) {
  const trip = {
    id: Date.now().toString(36),
    planId: plan.id,
    planTitle: plan.title,
    createdAt: new Date().toISOString(),
    days: plan.days.map(d => ({
      steps: d.steps.map(() => ({ likes: 0, dislikes: 0 }))
    }))
  };
  const trips = JSON.parse(localStorage.getItem('trips') || '[]');
  trips.push(trip);
  localStorage.setItem('trips', JSON.stringify(trips));
  return trip;
}

function getTrips() {
  return JSON.parse(localStorage.getItem('trips') || '[]');
}


function updateTripStep(tripId, dayIdx, stepIdx, field) {
  const trips = getTrips();
  const trip = trips.find(t => t.id === tripId);
  if (trip) {
    trip.days[dayIdx].steps[stepIdx][field] = (trip.days[dayIdx].steps[stepIdx][field] || 0) + 1;
    localStorage.setItem("trips", JSON.stringify(trips));
  }
  return trip;
}

// === Full-screen Trip View ===
function openTripView(tripId) {
  const trips = getTrips();
  const trip = trips.find(t => t.id === tripId);
  if (!trip) return;
  const plan = PLANS.find(p => p.id === trip.planId);
  if (!plan) return;

  // Hide main UI, show full-screen trip
  document.querySelector('.top-bar').style.display = 'none';
  cardList.style.display = 'none';
  document.querySelector('.shortlist-fab')?.style.setProperty('display','none');

  // Create trip container
  let tripContainer = document.getElementById('tripFullscreen');
  if (!tripContainer) {
    tripContainer = document.createElement('div');
    tripContainer.id = 'tripFullscreen';
    tripContainer.className = 'trip-fullscreen';
    document.body.appendChild(tripContainer);
  }
  tripContainer.style.display = 'block';

  const numDays = plan.days.length;
  let currentDayIdx = 0;
  for (let i = 0; i < numDays; i++) {
    if (trip.days[i].steps.some(s => (s.likes || 0) + (s.dislikes || 0) === 0)) { currentDayIdx = i; break; }
  }

  function renderTripDay(dayIdx) {
    const day = plan.days[dayIdx];
    const tripDay = trip.days[dayIdx];
    const totalSteps = tripDay.steps.length;

    const weekday = ['周日','周一','周二','周三','周四','周五','周六'];
    const startDate = new Date(trip.createdAt);
    const dayTabs = plan.days.map((_, i) => {
      const dt = new Date(startDate); dt.setDate(startDate.getDate() + i);
      const dayDone = trip.days[i].steps.every(s => (s.likes || 0) + (s.dislikes || 0) > 0);
      return `<button class="view-tab ${i === dayIdx ? 'active' : ''} ${dayDone ? 'tab-done' : ''}" data-day="${i}">
        <span class="vt-day">${dt.getMonth()+1}/${dt.getDate()} ${weekday[dt.getDay()]}</span>
        <span class="vt-weather">${plan.days[i].weather?.icon || ''}${plan.days[i].weather?.temp || ''}</span>
      </button>`;
    }).join('');

    // Steps with swipe
    const stepsHTML = day.steps.map((step, si) => {
      const stepData = tripDay.steps[si] || { likes: 0, dislikes: 0 };
      const color = TYPE_COLORS[step.type] || "#999";
      const durations = [];
      if (step.startTime && step.endTime) {
        const mins = timeDiffMin(step.startTime, step.endTime);
        durations.push(mins >= 60 ? `${(mins/60).toFixed(1).replace(/\.0$/,"")}h` : `${mins}min`);
      }
      return `
        <div class="tl-step" data-day="${dayIdx}" data-step="${si}">
          <div class="tl-left">
            <span class="tl-time">${step.startTime || ""}</span>
            <div class="tl-dot" style="background:${color}"></div>
            ${si < day.steps.length - 1 ? `<div class="tl-line" style="background:${color}"></div>` : ""}
          </div>
          <div class="tl-right">
            <div class="tl-step-swipe">
              <div class="trip-step-main">
              <div class="trip-step-info">
                <div class="tl-step-header">
                  <span class="tl-type" style="color:${color}">${TYPE_LABELS[step.type] || ""} ${durations.join("")}</span>
                  <span class="tl-step-text">${step.text}</span>
                </div>
                ${step.type !== "home" ? `<div class="tl-step-extras">
                  ${step.description ? `<p class="step-desc">${step.description}</p>` : ""}
                  <div class="step-actions">
                    ${step.place?.name ? `<a class="step-action-btn" href="https://uri.amap.com/navigation?to=${encodeURIComponent(step.place.name)}&mode=car" target="_blank">📍 导航到${step.place.name}</a>` : ""}
                    ${(step.bookings || []).map(b => `<span class="step-action-btn step-action-book">${b.label}${b.cost ? " "+b.cost : ""}</span>`).join("")}
                  </div>
                  ${(step.relatedContent || []).map(c => `<a class="step-rec" href="#"><span class="sr-platform">${c.icon}</span><span class="sr-title">${c.title}</span><span class="sr-likes">❤️ ${c.likes}</span></a>`).join("")}
                  ${(step.tips || []).map(t => `<div class="step-tip">💡 ${t}</div>`).join("")}
                </div>` : ""}
              </div>
              <div class="trip-votes">
                <button class="vote-btn vote-up" data-day="${dayIdx}" data-step="${si}" data-type="likes">👍<span class="vote-count">${stepData.likes || ""}</span></button>
                <button class="vote-btn vote-down" data-day="${dayIdx}" data-step="${si}" data-type="dislikes">👎<span class="vote-count">${stepData.dislikes || ""}</span></button>
              </div>
            </div>
              <div class="swipe-del-btn" data-day="${dayIdx}" data-step="${si}">删除</div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    tripContainer.innerHTML = `
      <div class="trip-topbar">
        <button class="trip-back" id="tripBack">← 返回</button>
        <h2 class="trip-title">${plan.title}</h2>
        <button class="trip-share-sm" id="tripShareBtn2">📤</button>
      </div>
      </div>
      <div class="detail-photo-weather">
        <div class="detail-hero-photo">
          <img src="${imgUrl(day.photo)}" alt="${day.activity}">
          <div class="hero-activity">${day.activity}</div>
          <div class="hero-hourly">${buildHourlyChart(day)}</div>
        </div>
      </div>
      <div class="view-tabs-row">${dayTabs}</div>
      <div class="day-steps-timeline">${stepsHTML}</div>
      <button class="add-step-btn" data-day="${dayIdx}" data-after="${day.steps.length - 1}">+ 添加行程</button>
      ${getDayRoutePoints(plan, dayIdx).length >= 2 ? '<div class="detail-section"><h4 class="detail-section-title">路线</h4><div id="tripRouteMap" class="route-map"></div></div>' : ''}
    `;

    // Back button
    document.getElementById('tripBack').addEventListener('click', closeTripView);

    // Share button
    document.getElementById('tripShareBtn2').addEventListener('click', () => {
      const url = `${location.origin}${location.pathname}?trip=${trip.id}`;
      if (navigator.share) { navigator.share({ title: plan.title, url }); }
      else { navigator.clipboard.writeText(url).then(() => alert('链接已复制')); }
    });

    // Day tabs
    tripContainer.querySelectorAll('.view-tab').forEach(tab => {
      tab.addEventListener('click', () => renderTripDay(parseInt(tab.dataset.day)));
    });

    // Vote buttons (like/dislike, can tap multiple times)
    tripContainer.querySelectorAll('.vote-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const di = parseInt(btn.dataset.day);
        const si = parseInt(btn.dataset.step);
        const field = btn.dataset.type;
        updateTripStep(trip.id, di, si, field);
        // Update count display
        const countEl = btn.querySelector('.vote-count');
        const trips2 = getTrips();
        const t = trips2.find(t2 => t2.id === trip.id);
        const val = t.days[di].steps[si][field];
        countEl.textContent = val || '';
        // Animate
        btn.classList.add('vote-pop');
        setTimeout(() => btn.classList.remove('vote-pop'), 200);
      });
    });

    // Delete step via swipe
    tripContainer.querySelectorAll(".swipe-del-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const di = parseInt(btn.dataset.day);
        const si = parseInt(btn.dataset.step);
        plan.days[di].steps.splice(si, 1);
        deleteTripStep(trip.id, di, si);
        renderTripDay(dayIdx);
      });
    });

    // Swipe gesture on steps
    tripContainer.querySelectorAll(".tl-step-swipe").forEach(el => {
      let startX = 0, currentX = 0, swiping = false;
      const main = el.querySelector(".trip-step-main");
      el.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX; swiping = true; main.style.transition = "none";
      });
      el.addEventListener("touchmove", (e) => {
        if (!swiping) return;
        currentX = e.touches[0].clientX;
        const dx = Math.min(0, currentX - startX);
        main.style.transform = `translateX(${dx}px)`;
      });
      el.addEventListener("touchend", () => {
        swiping = false; main.style.transition = "transform .2s ease";
        const dx = currentX - startX;
        main.style.transform = dx < -60 ? "translateX(-72px)" : "translateX(0)";
      });
    });

    // Add step button
    tripContainer.querySelectorAll(".add-step-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const di = parseInt(btn.dataset.day);
        const after = parseInt(btn.dataset.after);
        showAddStepForm(trip.id, plan, di, after, renderTripDay);
      });
    });

    // Render map
    const tripRoute = getDayRoutePoints(plan, dayIdx);
    if (tripRoute.length >= 2 && window.L) {
      setTimeout(() => {
        const mapEl = document.getElementById('tripRouteMap');
        if (!mapEl) return;
        try {
          const map = L.map(mapEl, { zoomControl: false, attributionControl: false });
          L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', { maxZoom: 18 }).addTo(map);
          const coords = tripRoute.map(p => `${p.lng},${p.lat}`).join(';');
          fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`)
            .then(r => r.json()).then(data => {
              if (data.routes?.[0]) L.polyline(data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]), { color: '#FF6B4A', weight: 3, opacity: 0.85 }).addTo(map);
            }).catch(() => {});
          tripRoute.forEach((p, i) => {
            L.circleMarker([p.lat, p.lng], { radius: 5, fillColor: '#FF6B4A', color: '#fff', weight: 2, fillOpacity: 1 })
              .addTo(map).bindTooltip(p.name, { permanent: true, direction: ['top','right','left','bottom'][i % 4], offset: [0, -8], className: 'map-label-sm' });
          });
          map.fitBounds(tripRoute.map(p => [p.lat, p.lng]), { padding: [40, 40] });
        } catch(e) {}
      }, 300);
    }
  }

  renderTripDay(currentDayIdx);
}

function closeTripView() {
  const tripContainer = document.getElementById('tripFullscreen');
  if (tripContainer) tripContainer.style.display = 'none';
  document.querySelector('.top-bar').style.display = '';
  cardList.style.display = '';
  document.querySelector('.shortlist-fab')?.style.setProperty('display','');
}

// Event delegation for trip buttons
document.addEventListener('click', (e) => {
  const tripBtn = e.target.closest('.trip-start-btn');
  if (tripBtn) {
    const planId = tripBtn.dataset.planId;
    const plan = PLANS.find(p => p.id === planId);
    if (plan) {
      // Auto-save if not already saved
      if (!savedIds.has(plan.id)) {
        savedIds.add(plan.id);
        updateBadge();
        const h = document.querySelector(`.card-heart[data-id="${plan.id}"]`);
        if (h) h.classList.add('saved');
      }
      const trip = createTrip(plan);
      closeDetail();
      setTimeout(() => openTripView(trip.id), 300);
    }
  }
  const tripItem = e.target.closest('.trip-item');
  if (tripItem) {
    const overlay = tripItem.closest('.shortlist-overlay');
    if (overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; }
    setTimeout(() => openTripView(tripItem.dataset.tripId), 300);
  }
});

// === Trip FAB (quick access to latest active trip) ===
function updateTripFab() {
  let fab = document.getElementById('tripFab');
  const trips = getTrips();
  // Find latest trip with pending steps
  const activeTrip = [...trips].reverse().find(t => 
    t.days.some(d => d.steps.some(s => (s.likes || 0) + (s.dislikes || 0) === 0))
  );
  
  if (!activeTrip) {
    if (fab) fab.style.display = 'none';
    return;
  }
  
  if (!fab) {
    fab = document.createElement('div');
    fab.id = 'tripFab';
    fab.className = 'trip-fab';
    document.body.appendChild(fab);
  }
  
  const plan = PLANS.find(p => p.id === activeTrip.planId);
  const totalSteps = activeTrip.days.reduce((a, d) => a + d.steps.length, 0);
  const doneSteps = activeTrip.days.reduce((a, d) => a + d.steps.filter(s => (s.likes || 0) + (s.dislikes || 0) > 0).length, 0);
  const pct = Math.round(doneSteps / totalSteps * 100);
  
  fab.innerHTML = '<span class="fab-icon">👣</span>';
  fab.style.display = 'flex';
  fab.onclick = () => openTripView(activeTrip.id);
}

// Update FAB on page load and after trip changes
updateTripFab();

// === Trip step edit (add/delete) ===
function deleteTripStep(tripId, dayIdx, stepIdx) {
  const trips = getTrips();
  const trip = trips.find(t => t.id === tripId);
  if (trip && trip.days[dayIdx]) {
    trip.days[dayIdx].steps.splice(stepIdx, 1);
    localStorage.setItem('trips', JSON.stringify(trips));
  }
}

function _timeToMin(t) { if (!t) return 0; const [h,m] = t.split(":").map(Number); return h * 60 + m; }

function addTripStep(tripId, dayIdx, afterStepIdx, stepData) {
  const trips = getTrips();
  const trip = trips.find(t => t.id === tripId);
  if (trip && trip.days[dayIdx]) {
    const newStep = { likes: 0, dislikes: 0, custom: true, ...stepData };
    trip.days[dayIdx].steps.splice(afterStepIdx + 1, 0, newStep);
    localStorage.setItem('trips', JSON.stringify(trips));
  }
}

function showAddStepForm(tripId, plan, dayIdx, afterStepIdx, renderFn) {
  const overlay = document.createElement('div');
  overlay.className = 'add-step-overlay';
  overlay.innerHTML = `
    <div class="add-step-form">
      <h3>添加行程</h3>
      <input type="text" id="addStepText" placeholder="做什么？如：午餐吃火锅" class="add-step-input">
      <input type="text" id="addStepPlace" placeholder="在哪？如：海底捞(平江路店)" class="add-step-input">
      <div class="add-step-time-row">
        <input type="time" id="addStepStart" class="add-step-time" value="12:00">
        <span class="time-sep">→</span>
        <input type="time" id="addStepEnd" class="add-step-time" value="13:00">
      </div>
      <div class="add-step-types">
        <button class="type-btn active" data-type="play">📍 玩</button>
        <button class="type-btn" data-type="eat">🍽️ 吃</button>
        <button class="type-btn" data-type="transit">🚗 路上</button>
        <button class="type-btn" data-type="stay">🏠 住</button>
      </div>
      <div class="add-step-actions">
        <button class="add-step-cancel">取消</button>
        <button class="add-step-confirm">确定添加</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  let selectedType = 'play';
  overlay.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      overlay.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedType = btn.dataset.type;
    });
  });

  overlay.querySelector('.add-step-cancel').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

  overlay.querySelector('.add-step-confirm').addEventListener('click', () => {
    const text = document.getElementById('addStepText').value.trim();
    const place = document.getElementById('addStepPlace').value.trim();
    const startTime = document.getElementById("addStepStart").value || "";
    const endTime = document.getElementById("addStepEnd").value || "";
    if (!text) return;
    
    const planDay = plan.days[dayIdx];
    const newPlanStep = {
      text: text,
      type: selectedType,
      startTime: startTime,
      endTime: endTime,
      description: "",
    };
    if (place) newPlanStep.place = { name: place };
    
    // Insert at correct time position
    let insertIdx = planDay.steps.length;
    if (startTime) {
      for (let i = 0; i < planDay.steps.length; i++) {
        if (planDay.steps[i].startTime && _timeToMin(planDay.steps[i].startTime) > _timeToMin(startTime)) {
          insertIdx = i;
          break;
        }
      }
    }
    planDay.steps.splice(insertIdx, 0, newPlanStep);
    
    // Also insert in trip data at same position
    const trips = getTrips();
    const t = trips.find(t2 => t2.id === tripId);
    if (t && t.days[dayIdx]) {
      t.days[dayIdx].steps.splice(insertIdx, 0, { likes: 0, dislikes: 0, custom: true });
      localStorage.setItem("trips", JSON.stringify(trips));
    }
    overlay.remove();
    renderFn(dayIdx);
  });
}
