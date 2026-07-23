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

// Add directional arrows along route
function addRouteArrows(map, routePoints) {
  for (let i = 0; i < routePoints.length - 1; i++) {
    const p1 = routePoints[i], p2 = routePoints[i + 1];
    const midLat = (p1.lat + p2.lat) / 2;
    const midLng = (p1.lng + p2.lng) / 2;
    const angle = Math.atan2(p2.lng - p1.lng, p2.lat - p1.lat) * 180 / Math.PI;
    L.marker([midLat, midLng], {
      icon: L.divIcon({
        className: 'route-arrow',
        html: `<div style="transform:rotate(${90 - angle}deg)">▶</div>`,
        iconSize: [16, 16], iconAnchor: [8, 8]
      })
    }).addTo(map);
  }
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
        ${getRoutePoints(plan).length >= 2 ? `<div class="card-timeline" id="timeline-${plan.id}"></div><div class="card-map" id="cardMap-${plan.id}"></div>` : ''}
      </div>
    `;
    card.addEventListener('click', (e) => { if (e.target.closest('.card-heart')) return; openDetail(plan); });
    const heartBtn = card.querySelector('.card-heart');
    heartBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleSave(plan.id, heartBtn); });
    cardList.appendChild(card);
  });
  lazyLoadImages();
  initCardMaps(filtered);
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
    html += `<span><i style="background:#34C759"></i>玩 ${playH.toFixed(1)}h</span>`;
    html += `<span><i style="background:#BBBBC0"></i>路上 ${travelH.toFixed(1)}h</span>`;
    if (sleepH > 0) html += `<span><i style="background:#5856D6"></i>住 ${sleepH.toFixed(0)}h</span>`;
    html += '</div>';
    el.innerHTML = html;
  });
}
function _timeToHours(t) { if (!t) return 8; const [h,m] = t.split(':').map(Number); return h + m/60; }

// === Init Card Maps ===
function initCardMaps(plans) {
  plans.forEach(plan => {
    const route = getRoutePoints(plan);
    if (route.length < 2 || !window.L) return;
    const mapEl = document.getElementById(`cardMap-${plan.id}`);
    if (!mapEl) return;
    setTimeout(() => {
      const map = L.map(mapEl, {
        zoomControl: false, attributionControl: false,
        dragging: false, scrollWheelZoom: false, doubleClickZoom: false,
        touchZoom: false, boxZoom: false, keyboard: false, tap: false
      });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', { maxZoom: 18 }).addTo(map);
      const pts = route.map(p => [p.lat, p.lng]);
      const coords = route.map(p => `${p.lng},${p.lat}`).join(';');
      fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`)
        .then(r => r.json())
        .then(data => {
          if (data.routes?.[0]) {
            const rc = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
            L.polyline(rc, { color: '#FF6B4A', weight: 2.5, opacity: 0.8 }).addTo(map);
          }
        }).catch(() => {});
      route.forEach((p, i) => {
        L.circleMarker([p.lat, p.lng], {
          radius: 5, fillColor: '#FF6B4A', color: '#fff', weight: 2, fillOpacity: 1
        }).addTo(map).bindTooltip(p.name, { permanent: true, direction: ['top','right','left','bottom'][i % 4], offset: [0, -8], className: 'map-label-sm' });
      });
      const d = derivePlan(plan);
      d.legs.forEach((leg, i) => {
        if (i >= pts.length - 1) return;
        const midLat = (pts[i][0] + pts[i+1][0]) / 2, midLng = (pts[i][1] + pts[i+1][1]) / 2;
        L.marker([midLat, midLng], {
          icon: L.divIcon({ className: 'leg-label', html: leg, iconSize: [50, 14], iconAnchor: [25, 7] })
        }).addTo(map);
      });
      addRouteArrows(map, route);
      map.fitBounds(pts, { padding: [20, 20] });
    }, 200);
  });
}

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
const TYPE_COLORS = { depart:'#4A90D9', transit:'#BBBBC0', play:'#34C759', eat:'#FF9500', stay:'#5856D6', home:'#FF9800' };
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
      html += `<span><i style="background:#34C759"></i>玩 ${playH.toFixed(1)}h</span>`;
      html += `<span><i style="background:#BBBBC0"></i>路上 ${travelH.toFixed(1)}h</span>`;
      if (sleepH > 0) html += `<span><i style="background:#5856D6"></i>住 ${sleepH.toFixed(0)}h</span>`;
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

      ${getRoutePoints(plan).length >= 2 ? '<div class="detail-section"><h4 class="detail-section-title">路线地图</h4><div id="routeMap" class="route-map"></div></div>' : ''}

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
        <button class="detail-cta-btn" data-id="${plan.id}">${savedIds.has(plan.id) ? '✓ 已收藏' : '❤️ 加入行程'}</button>
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
    // Bind CTA
    const ctaBtn = detailBody.querySelector('.detail-cta-btn');
    ctaBtn.addEventListener('click', () => {
      if (!savedIds.has(plan.id)) {
        savedIds.add(plan.id);
        ctaBtn.textContent = '✓ 已收藏';
        updateBadge();
        const h = document.querySelector(`.card-heart[data-id="${plan.id}"]`);
        if (h) h.classList.add('saved');
      }
    });
    // Render map
    if (isOverview) renderDetailMap(plan);
    else renderDayMap(plan, mode);
  }

  renderDetailView(numDays > 1 ? 'overview' : 0);
  detailOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// === Detail Map (Overview) ===
function renderDetailMap(plan) {
  const route = getRoutePoints(plan);
  if (route.length < 2 || !window.L) return;
  setTimeout(() => {
    const mapEl = document.getElementById('routeMap');
    if (!mapEl) return;
    const map = L.map(mapEl, { zoomControl: false, attributionControl: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', { maxZoom: 18 }).addTo(map);
    const pts = route.map(p => [p.lat, p.lng]);
    const coords = route.map(p => `${p.lng},${p.lat}`).join(';');
    fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`)
      .then(r => r.json()).then(data => {
        if (data.routes?.[0]) L.polyline(data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]), { color: '#FF6B4A', weight: 3, opacity: 0.85 }).addTo(map);
      }).catch(() => {});
    route.forEach((p, i) => {
      L.circleMarker([p.lat, p.lng], { radius: 5, fillColor: '#FF6B4A', color: '#fff', weight: 2, fillOpacity: 1 })
        .addTo(map).bindTooltip(p.name, { permanent: true, direction: ['top','right','left','bottom'][i % 4], offset: [0, -8], className: 'map-label-sm' });
    });
    const d = derivePlan(plan);
    d.legs.forEach((leg, i) => {
      if (i >= pts.length - 1) return;
      const midLat = (pts[i][0] + pts[i+1][0]) / 2, midLng = (pts[i][1] + pts[i+1][1]) / 2;
      L.marker([midLat, midLng], { icon: L.divIcon({ className: 'leg-label', html: leg, iconSize: [60, 16], iconAnchor: [30, 8] }) }).addTo(map);
    });
    addRouteArrows(map, route);
    map.fitBounds(pts, { padding: [35, 35] });
  }, 300);
}

function renderDayMap(plan, dayIdx) {
  const route = getDayRoutePoints(plan, dayIdx);
  if (route.length < 2 || !window.L) return;
  setTimeout(() => {
    const mapEl = document.getElementById('dayRouteMap');
    if (!mapEl) return;
    const map = L.map(mapEl, { zoomControl: false, attributionControl: false });
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
    addRouteArrows(map, route);
    map.fitBounds(route.map(p => [p.lat, p.lng]), { padding: [40, 40] });
  }, 300);
}

function closeDetail() {
  detailOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

// === Shortlist ===
function openShortlist() {
  const saved = PLANS.filter(p => savedIds.has(p.id));
  shortlistBody.innerHTML = saved.length === 0
    ? '<p class="panel-empty">还没收藏方案<br>看看有没有心动的？</p>'
    : saved.map(p => `
      <div class="sl-item" data-id="${p.id}">
        <img class="sl-img" src="${imgUrl(p.days[0].photo)}" alt="${p.title}">
        <div class="sl-info"><h4>${p.title}</h4><p>${derivePlan(p).duration} · ${derivePlan(p).transitLabel}</p></div>
      </div>
    `).join('');
  shortlistOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  shortlistBody.querySelectorAll('.sl-item').forEach(el => {
    el.addEventListener('click', () => {
      const plan = PLANS.find(p => String(p.id) === el.dataset.id);
      if (plan) { closeShortlist(); openDetail(plan); }
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
renderCards();
