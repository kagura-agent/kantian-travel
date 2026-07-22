// === State ===
let savedIds = new Set();
let currentFilter = 'weekend';

// === Route Map Overlay SVG (semi-transparent on photos) ===
function routeOverlaySVG(route, totalH) {
  if (!route || route.length < 2) return '';
  
  const lats = route.map(p => p.lat);
  const lngs = route.map(p => p.lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const latRange = maxLat - minLat || 0.1;
  const lngRange = maxLng - minLng || 0.1;

  const W = 80;
  const H = totalH;
  const pad = 16;

  const points = route.map(p => ({
    x: pad + ((p.lng - minLng) / lngRange) * (W - pad * 2),
    y: pad + ((maxLat - p.lat) / latRange) * (H - pad * 2), // invert Y (north=up)
    name: p.name
  }));

  let svg = `<svg class="route-overlay" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">`;
  
  // Route line (dashed)
  const linePts = points.map(p => `${p.x},${p.y}`).join(' ');
  svg += `<polyline points="${linePts}" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" stroke-dasharray="4,3" stroke-linecap="round"/>`;
  
  // Dots
  points.forEach((p, i) => {
    const r = i === 0 ? 4 : 3;
    svg += `<circle cx="${p.x}" cy="${p.y}" r="${r}" fill="${i === 0 ? '#FF6B4A' : 'rgba(255,255,255,0.9)'}" stroke="rgba(255,255,255,0.8)" stroke-width="1"/>`;
    // Label for first and last
    if (i === 0 || i === points.length - 1) {
      svg += `<text x="${p.x}" y="${p.y - 6}" text-anchor="middle" font-size="8" fill="rgba(255,255,255,0.85)" font-weight="500" style="text-shadow:0 1px 2px rgba(0,0,0,.8)">${p.name}</text>`;
    }
  });

  svg += '</svg>';
  return svg;
}

// === Weather Chart SVG (overlaid on photo stack) ===
function weatherOverlaySVG(days) {
  const n = days.length;
  const temps = days.map(d => parseInt(d.weather.temp));
  const minT = Math.min(...temps) - 2;
  const maxT = Math.max(...temps) + 2;
  const range = maxT - minT || 1;

  // Each strip is 120px, so total height = n * 120
  const stripH = 120;
  const W = 70;
  const H = n * stripH;

  let svg = `<svg class="weather-overlay" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">`;
  
  const points = days.map((d, i) => {
    const y = (i * stripH) + (stripH / 2); // center of each photo strip
    const x = 10 + ((parseInt(d.weather.temp) - minT) / range) * 30;
    return { x, y, ...d.weather };
  });

  // Line
  if (n > 1) {
    const linePts = points.map(p => `${p.x},${p.y}`).join(' ');
    svg += `<polyline points="${linePts}" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  }

  // Dots + labels
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
  'tomorrow': ['tomorrow'],
  'weekend': ['weekend'],
  'next-weekend': ['weekend'],
  '3day': ['3day'],
  '5day': ['5day'],
  'week': ['week']
};

// === Render Cards ===
function imgUrl(id) {
  return `https://images.unsplash.com/${id}?w=800&h=300&fit=crop&q=80`;
}

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
    const isSaved = savedIds.has(plan.id);

    // Build photo stack
    const photoStack = plan.days.map(day => `
      <div class="day-strip">
        <img class="day-photo" data-src="${imgUrl(day.photo)}" alt="${day.activity}" loading="lazy">
        <div class="day-overlay">
          <span class="day-label">${day.label}</span>
          <span class="day-activity">${day.activity}</span>
        </div>
      </div>
    `).join('');

    const stripH = 120;
    const totalPhotoH = plan.days.length * stripH;

    card.innerHTML = `
      <div class="card-photos" data-days="${plan.days.length}">
        ${photoStack}
        ${weatherOverlaySVG(plan.days)}
        <button class="card-heart ${isSaved ? 'saved' : ''}" data-id="${plan.id}">
          <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <span class="card-duration">${plan.duration}</span>
      </div>
      <div class="card-info">
        <h3 class="card-title">${plan.title}</h3>
        <div class="card-meta">
          <span class="card-transit">${plan.transit}</span>
          <span class="card-price">${(() => { const tl = TIMELINES[plan.id]; if (!tl) return plan.stayType + ' ' + plan.price; const total = tl.filter(s=>s.cost).reduce((a,s)=>a+parseInt(s.cost.replace('¥','')||'0'),0); return '约¥' + total + '/人'; })()}</span>
        </div>
        ${plan.route && plan.route.length > 1 ? `<div class="card-timeline" id="timeline-${plan.id}"></div><div class="card-map" id="cardMap-${plan.id}"></div>` : ''}
      </div>
    `;

    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-heart')) return;
      openDetail(plan);
    });

    const heartBtn = card.querySelector('.card-heart');
    heartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSave(plan.id, heartBtn);
    });

    cardList.appendChild(card);
  });

  lazyLoadImages();
  initCardMaps(filtered);
  initTimelines(filtered);
}

// === Timeline Bar ===
function initTimelines(plans) {
  plans.forEach(plan => {
    const tl = TIMELINES[plan.id];
    if (!tl) return;
    const el = document.getElementById(`timeline-${plan.id}`);
    if (!el) return;
    
    const totalH = tl[tl.length - 1].end;
    const colors = { travel: '#BBBBC0', play: '#34C759', sleep: '#5856D6' };
    
    let html = '<div class="tl-bar">';
    tl.forEach(seg => {
      const pct = ((seg.end - seg.start) / totalH * 100).toFixed(1);
      const costLabel = (seg.type === "travel" || seg.type === "sleep") && seg.cost ? `<span class="tl-cost">${seg.cost}</span>` : ""; html += `<div class="tl-seg" style="width:${pct}%;background:${colors[seg.type]}" title="${seg.label}">${costLabel}</div>`;
    });
    html += '</div>';
    
    // Legend
    const travelH = tl.filter(s=>s.type==='travel').reduce((a,s)=>a+(s.end-s.start),0);
    const playH = tl.filter(s=>s.type==='play').reduce((a,s)=>a+(s.end-s.start),0);
    const sleepH = tl.filter(s=>s.type==='sleep').reduce((a,s)=>a+(s.end-s.start),0);
    html += `<div class="tl-legend">`;
    const travelPct = (travelH/totalH*100).toFixed(0); const playPct = (playH/totalH*100).toFixed(0); const sleepPct = (sleepH/totalH*100).toFixed(0); html += `<span><i style="background:#34C759"></i>玩 ${playH.toFixed(1)}h (${playPct}%)</span>`;
    html += `<span><i style="background:#BBBBC0"></i>路上 ${travelH.toFixed(1)}h (${travelPct}%)</span>`;
    if (sleepH > 0) html += `<span><i style="background:#5856D6"></i>住 ${sleepH.toFixed(0)}h (${sleepPct}%)</span>`;
    html += '</div>';
    
    el.innerHTML = html;
  });
}

// === Init Card Maps ===
function initCardMaps(plans) {
  if (!window.L) return;
  setTimeout(() => {
    plans.forEach(plan => {
      if (!plan.route || plan.route.length < 2) return;
      const mapEl = document.getElementById(`cardMap-${plan.id}`);
      if (!mapEl) return;
      const map = L.map(mapEl, { zoomControl: false, attributionControl: false, dragging: false, scrollWheelZoom: false, touchZoom: false, doubleClickZoom: false });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', { maxZoom: 18 }).addTo(map);
      const pts = plan.route.map(p => [p.lat, p.lng]);
      
      // Split route: outbound (all except last) and return (last dest → home)
      const outCoords = plan.route.slice(0, -1).map(p => `${p.lng},${p.lat}`).join(';');
      const lastDest = plan.route[plan.route.length - 2];
      const home = plan.route[plan.route.length - 1];
      const retCoords = `${lastDest.lng},${lastDest.lat};${home.lng},${home.lat}`;
      
      // Outbound route (orange solid)
      fetch(`https://router.project-osrm.org/route/v1/driving/${outCoords}?overview=full&geometries=geojson`)
        .then(r => r.json())
        .then(data => {
          if (data.routes && data.routes[0]) {
            const rc = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
            L.polyline(rc, { color: '#FF6B4A', weight: 3, opacity: 0.85 }).addTo(map);
          }
        }).catch(() => {});
      
      // Return route (blue dashed)
      fetch(`https://router.project-osrm.org/route/v1/driving/${retCoords}?overview=full&geometries=geojson`)
        .then(r => r.json())
        .then(data => {
          if (data.routes && data.routes[0]) {
            const rc = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
            L.polyline(rc, { color: '#4A90D9', weight: 2.5, opacity: 0.7, dashArray: '8,6' }).addTo(map);
          }
        }).catch(() => {});
      plan.route.forEach((p, i) => {
        L.circleMarker([p.lat, p.lng], {
          radius: 5, fillColor: '#FF6B4A', color: '#fff', weight: 2, fillOpacity: 1
        }).addTo(map).bindTooltip(p.name, { permanent: true, direction: ['top','right','left','bottom'][i % 4], offset: [0, -8], className: 'map-label-sm' });
      });
      // Transport labels between points
      if (plan.legs) {
        plan.legs.forEach((leg, i) => {
          if (i >= pts.length - 1) return;
          const midLat = (pts[i][0] + pts[i+1][0]) / 2;
          const midLng = (pts[i][1] + pts[i+1][1]) / 2;
          L.marker([midLat, midLng], {
            icon: L.divIcon({ className: 'leg-label', html: leg, iconSize: [50, 14], iconAnchor: [25, 7] })
          }).addTo(map);
        });
      }
      map.fitBounds(pts, { padding: [35, 35], maxZoom: 11 });
    });
  }, 500);
}

// === Lazy Load ===
function lazyLoadImages() {
  const images = document.querySelectorAll('[data-src]');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.onload = () => img.classList.add('loaded');
          delete img.dataset.src;
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '300px' });
    images.forEach(img => obs.observe(img));
  } else {
    images.forEach(img => { img.src = img.dataset.src; delete img.dataset.src; });
  }
}

// === Save/Shortlist ===
function toggleSave(id, btn) {
  if (savedIds.has(id)) { savedIds.delete(id); btn.classList.remove('saved'); }
  else { savedIds.add(id); btn.classList.add('saved'); btn.style.transform='scale(1.3)'; setTimeout(()=>btn.style.transform='',200); }
  updateBadge();
}
function updateBadge() {
  const c = savedIds.size;
  shortlistBadge.textContent = c;
  shortlistBadge.classList.toggle('show', c > 0);
}

// === Detail View ===
function buildTimelineHTML(planId) {
  const tl = TIMELINES[planId];
  if (!tl) return '';
  const totalH = tl[tl.length - 1].end;
  const colors = { travel: '#BBBBC0', play: '#34C759', sleep: '#5856D6' };
  
  let html = '<div class="detail-section"><h4 class="detail-section-title">时间分配</h4>';
  html += '<div class="tl-bar">';
  tl.forEach(seg => {
    const pct = ((seg.end - seg.start) / totalH * 100).toFixed(1);
    const costLabel = (seg.type === 'travel' || seg.type === 'sleep') && seg.cost ? `<span class="tl-cost">${seg.cost}</span>` : '';
    html += `<div class="tl-seg" style="width:${pct}%;background:${colors[seg.type]}" title="${seg.label}">${costLabel}</div>`;
  });
  html += '</div>';
  
  const travelH = tl.filter(s=>s.type==='travel').reduce((a,s)=>a+(s.end-s.start),0);
  const playH = tl.filter(s=>s.type==='play').reduce((a,s)=>a+(s.end-s.start),0);
  const sleepH = tl.filter(s=>s.type==='sleep').reduce((a,s)=>a+(s.end-s.start),0);
  const travelPct = (travelH/totalH*100).toFixed(0);
  const playPct = (playH/totalH*100).toFixed(0);
  const sleepPct = (sleepH/totalH*100).toFixed(0);
  html += '<div class="tl-legend">';
  html += `<span><i style="background:#34C759"></i>玩 ${playH.toFixed(1)}h (${playPct}%)</span>`;
  html += `<span><i style="background:#BBBBC0"></i>路上 ${travelH.toFixed(1)}h (${travelPct}%)</span>`;
  if (sleepH > 0) html += `<span><i style="background:#5856D6"></i>住 ${sleepH.toFixed(0)}h (${sleepPct}%)</span>`;
  html += '</div></div>';
  return html;
}

// === Detail View: 全览 + 分天 ===

function buildHourlyChart(hours) {
  const temps = hours.map(h => h.t);
  const minT = Math.min(...temps) - 1;
  const maxT = Math.max(...temps) + 1;
  const range = maxT - minT || 1;
  const W = 300, H = 60, padX = 25, padY = 10;
  const chartH = H - padY * 2;
  const points = hours.map((h, i) => ({
    x: padX + (i / (hours.length - 1)) * (W - padX * 2),
    y: padY + (1 - (h.t - minT) / range) * chartH,
    ...h
  }));
  let svg = `<svg class="hourly-chart" viewBox="0 0 ${W} ${H}">`;
  const line = points.map(p => `${p.x},${p.y}`).join(' ');
  svg += `<polyline points="${line}" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  points.forEach(p => {
    svg += `<circle cx="${p.x}" cy="${p.y}" r="3" fill="#fff"/>`;
    svg += `<text x="${p.x}" y="${p.y - 8}" text-anchor="middle" font-size="9" fill="#fff" font-weight="600" style="text-shadow:0 1px 3px rgba(0,0,0,.8)">${p.icon}${p.t}°</text>`;
    svg += `<text x="${p.x}" y="${H - 2}" text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.8)" style="text-shadow:0 1px 2px rgba(0,0,0,.8)">${p.h}:00</text>`;
  });
  svg += '</svg>';
  return svg;
}

function getHourlyData(day) {
  const baseTemp = parseInt(day.weather.temp);
  return [
    {h:'6', t:baseTemp-4, icon:'🌤️'},
    {h:'9', t:baseTemp-2, icon:day.weather.icon},
    {h:'12', t:baseTemp, icon:day.weather.icon},
    {h:'15', t:baseTemp+1, icon:day.weather.icon},
    {h:'18', t:baseTemp-1, icon:day.weather.icon},
    {h:'21', t:baseTemp-3, icon:'🌙'}
  ];
}

// Derive smart booking pills from itinerary text
// Get route points for a specific day
function getDayRoutePoints(plan, dayIdx) {
  const route = plan.route;
  const numDays = plan.days.length;
  if (!route || route.length < 2) return [];
  if (numDays === 1) return route;
  // Intermediate stops (exclude return to origin)
  const stops = route.length - 1;
  const stopsPerDay = Math.max(1, Math.ceil(stops / numDays));
  const startIdx = Math.min(dayIdx * stopsPerDay, stops);
  let endIdx = Math.min((dayIdx + 1) * stopsPerDay, stops);
  // Last day includes return
  if (dayIdx === numDays - 1) endIdx = route.length - 1;
  // Ensure at least 2 points (include previous day's last point as start)
  let points = route.slice(startIdx, endIdx + 1);
  if (points.length < 2 && startIdx > 0) {
    points = [route[startIdx - 1], ...points];
  }
  return points;
}

// Get legs (transport labels) for a specific day
function getDayLegs(plan, dayIdx) {
  const numDays = plan.days.length;
  if (!plan.legs) return [];
  const route = plan.route;
  const stops = route.length - 1;
  const stopsPerDay = Math.max(1, Math.ceil(stops / numDays));
  const startIdx = Math.min(dayIdx * stopsPerDay, stops);
  let endIdx = Math.min((dayIdx + 1) * stopsPerDay, stops);
  if (dayIdx === numDays - 1) endIdx = route.length - 1;
  return plan.legs.slice(startIdx, endIdx);
}

// Match related content to a specific day's activities
function getDayRelatedContent(planId, itinText) {
  const all = RELATED_CONTENT[planId] || [];
  if (!all.length) return [];
  const words = itinText.replace(/[→+·\(\)\!！]/g, ' ').split(/\s+/).filter(w => w.length >= 2);
  const matched = all.filter(c => {
    const tl = c.title.toLowerCase();
    return words.some(w => tl.includes(w.toLowerCase()));
  });
  // If no specific match, return all (better than nothing)
  return matched.length > 0 ? matched : all;
}

function getDayBookings(itinText, dayIdx, totalDays) {
  const pills = [];
  const t = itinText.toLowerCase();
  if (/高铁|火车|动车/.test(t) || (dayIdx === 0 && /→/.test(t))) pills.push('🚄 查车票');
  if (/自驾|租车|包车/.test(t)) pills.push('🚗 查租车');
  if (/门票|景区|寺|园|楼|山|博物馆|古村|古镇/.test(t)) pills.push('🎫 查门票');
  if (/骑行|租.*车/.test(t) && !pills.includes('🚗 查租车')) pills.push('🚲 租车/骑行');
  if (/民宿|客栈|酒店|住|入住/.test(t) || (dayIdx < totalDays - 1)) pills.push('🏠 查住宿');
  if (/船|游船|坐船/.test(t)) pills.push('🚢 查船票');
  if (/午餐|晚餐|餐|吃/.test(t)) pills.push('🍽️ 查餐厅');
  return [...new Set(pills)];
}

// Match tips relevant to a specific day's itinerary
function getDayTips(allTips, itinText) {
  if (!allTips.length) return [];
  const words = itinText.replace(/[→+·]/g, ' ').split(/\s+/).filter(w => w.length >= 2);
  return allTips.filter(tip => {
    const tl = tip.toLowerCase();
    return words.some(w => tl.includes(w.toLowerCase()));
  });
}

// Split timeline segments by day (using sleep as boundary)
function getTimelineForDay(planId, dayIdx, totalDays) {
  const tl = TIMELINES[planId];
  if (!tl) return null;
  // Find day boundaries by sleep segments
  const boundaries = [0]; // start of each day in hours
  tl.forEach(seg => {
    if (seg.type === 'sleep') boundaries.push(seg.end);
  });
  const dayStart = boundaries[dayIdx] || 0;
  const dayEnd = boundaries[dayIdx + 1] !== undefined ? boundaries[dayIdx + 1] : tl[tl.length - 1].end;
  // Get segments that fall in this day
  const daySegs = tl.filter(seg => {
    // Include segments that overlap with this day range
    // For first day: from start to first sleep end
    // For subsequent days: from sleep end to next sleep end
    if (dayIdx === 0) return seg.end <= (boundaries[1] || tl[tl.length-1].end + 1);
    const prevSleepEnd = boundaries[dayIdx];
    const nextSleepEnd = boundaries[dayIdx + 1] || tl[tl.length-1].end + 1;
    return seg.start >= prevSleepEnd && seg.start < nextSleepEnd;
  });
  return daySegs.length > 0 ? daySegs : null;
}

function buildDayTimelineHTML(segs) {
  if (!segs || !segs.length) return '';
  const totalH = segs[segs.length-1].end - segs[0].start;
  if (totalH <= 0) return '';
  const offset = segs[0].start;
  const colors = { travel: '#BBBBC0', play: '#34C759', sleep: '#5856D6' };
  let html = '<div class="detail-section"><h4 class="detail-section-title">今日时间分配</h4>';
  html += '<div class="tl-bar">';
  segs.forEach(seg => {
    const pct = ((seg.end - seg.start) / totalH * 100).toFixed(1);
    const costLabel = (seg.type === 'travel' || seg.type === 'sleep') && seg.cost ? `<span class="tl-cost">${seg.cost}</span>` : '';
    html += `<div class="tl-seg" style="width:${pct}%;background:${colors[seg.type]}" title="${seg.label}">${costLabel}</div>`;
  });
  html += '</div>';
  const travelH = segs.filter(s=>s.type==='travel').reduce((a,s)=>a+(s.end-s.start),0);
  const playH = segs.filter(s=>s.type==='play').reduce((a,s)=>a+(s.end-s.start),0);
  html += '<div class="tl-legend">';
  html += `<span><i style="background:#34C759"></i>玩 ${playH.toFixed(1)}h</span>`;
  html += `<span><i style="background:#BBBBC0"></i>路上 ${travelH.toFixed(1)}h</span>`;
  html += '</div></div>';
  return html;
}

function openDetail(plan) {
  const d = plan.detail;
  const isSaved = savedIds.has(plan.id);
  const tips = PLAN_TIPS[plan.id] || [];
  const numDays = plan.days.length;

  // === Build 全览 content ===
  function buildOverviewHTML() {
    return `
      <div class="detail-photo-weather">
        <div class="detail-hero-photo">
          <img src="${imgUrl(plan.days[0].photo)}" alt="${plan.title}">
          <div class="hero-activity">${plan.days.map(dy => dy.weather.icon).join(' ')} ${plan.duration}</div>
        </div>
      </div>

      ${buildTimelineHTML(plan.id)}

      ${plan.route ? '<div class="detail-section"><h4 class="detail-section-title">路线地图</h4><div id="routeMap" class="route-map"></div></div>' : ''}

      <div class="detail-section">
        <h4 class="detail-section-title">行程概览</h4>
        ${d.fullItinerary.map(day => `
          <div class="detail-itin-day">
            <span class="di-label">${day.label}</span>
            <p class="di-content">${day.content}</p>
          </div>
        `).join('')}
      </div>

      <div class="detail-section">
        <h4 class="detail-section-title">交通信息</h4>
        <div class="detail-transit-info">
          ${d.transitInfo.map(t => `<p class="dt-row">${t}</p>`).join('')}
        </div>
      </div>

      <div class="detail-section">
        <h4 class="detail-section-title">住宿</h4>
        <p class="detail-stay">${d.accommodation}</p>
      </div>

      ${tips.length > 0 ? `
      <div class="detail-section">
        <h4 class="detail-section-title">小贴士</h4>
        <div class="detail-tips">
          ${tips.map(tip => `<div class="tip-item">💡 ${tip}</div>`).join('')}
        </div>
      </div>` : ''}

      <div class="detail-section">
        <h4 class="detail-section-title">种草内容</h4>
        <div class="related-content">
          ${(RELATED_CONTENT[plan.id] || []).map(c => `
            <div class="related-card" style="border-left:3px solid ${c.color}">
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
          <span class="booking-pill">🚄 查车票 →</span>
          <span class="booking-pill">🏠 查住宿 →</span>
          <span class="booking-pill">🎫 查门票 →</span>
        </div>
      </div>
    `;
  }

  // === Build 分天 content ===
  function buildDayHTML(dayIdx) {
    const day = plan.days[dayIdx];
    const itin = d.fullItinerary[dayIdx];
    const itinText = itin ? itin.content : day.activity;
    const dayBookings = getDayBookings(itinText, dayIdx, numDays);
    const dayTips = getDayTips(tips, itinText);
    const dayTimeline = getTimelineForDay(plan.id, dayIdx, numDays);
    const hourly = getHourlyData(day);
    const dayRoutePoints = getDayRoutePoints(plan, dayIdx);
    const dayLegs = getDayLegs(plan, dayIdx);
    const dayContent = getDayRelatedContent(plan.id, itinText);

    // Split itinerary into steps (by → or +)
    const steps = itinText.split(/[\u2192\+]/).map(s => s.trim()).filter(Boolean);

    // Build step-by-step itinerary with nav buttons
    function buildStepsHTML() {
      let html = '<div class="day-steps">';
      steps.forEach((step, i) => {
        // Try to find matching route point for navigation
        let navHTML = '';
        if (i < steps.length - 1) {
          // Try to find a destination point to navigate to
          const destIdx = Math.min(i + 1, dayRoutePoints.length - 1);
          if (dayRoutePoints.length >= 2 && destIdx > 0) {
            const to = dayRoutePoints[destIdx];
            const navUrl = `https://uri.amap.com/navigation?to=${to.lng},${to.lat},${to.name}&mode=car`;
            navHTML = `<a class="step-nav-btn" href="${navUrl}" target="_blank">导航去${to.name}</a>`;
          }
        }
        const isTransit = /高铁|火车|自驾|打车|坐车|转车|公交|地铁|返程|出发|到达/.test(step);
        html += `
          <div class="day-step ${isTransit ? 'step-transit' : 'step-play'}">
            <div class="step-icon">${isTransit ? '🚗' : '📍'}</div>
            <div class="step-content">
              <span class="step-text">${step}</span>
              ${navHTML}
            </div>
          </div>
          ${i < steps.length - 1 ? '<div class="step-connector"></div>' : ''}
        `;
      });
      html += '</div>';
      return html;
    }

    // Build transit nav buttons — destination only (GPS knows where you are)
    function buildTransitNavHTML() {
      if (dayRoutePoints.length < 2) return '';
      let html = '<div class="detail-section"><h4 class="detail-section-title">今日导航</h4><div class="transit-nav-list">';
      // Show each destination point (skip the first one which is where you start)
      for (let i = 1; i < dayRoutePoints.length; i++) {
        const to = dayRoutePoints[i];
        const leg = dayLegs[i - 1] || '';
        const navUrl = `https://uri.amap.com/navigation?to=${to.lng},${to.lat},${to.name}&mode=car`;
        html += `
          <a class="transit-nav-item" href="${navUrl}" target="_blank">
            <div class="tn-info">
              <span class="tn-route">📍 ${to.name}</span>
              <span class="tn-leg">${leg}</span>
            </div>
            <span class="tn-action">导航去这里</span>
          </a>
        `;
      }
      html += '</div></div>';
      return html;
    }

    return `
      <div class="detail-photo-weather">
        <div class="detail-hero-photo">
          <img src="${imgUrl(day.photo)}" alt="${day.activity}">
          <div class="hero-activity">${day.activity}</div>
          <div class="hero-hourly">${buildHourlyChart(hourly)}</div>
        </div>
      </div>

      ${dayTimeline ? buildDayTimelineHTML(dayTimeline) : ''}

      <div class="detail-section">
        <h4 class="detail-section-title">今日行程</h4>
        ${buildStepsHTML()}
      </div>

      ${dayRoutePoints.length >= 2 ? '<div class="detail-section"><h4 class="detail-section-title">今日路线</h4><div id="dayRouteMap" class="route-map"></div></div>' : ''}

      ${buildTransitNavHTML()}

      ${dayBookings.length > 0 ? `
      <div class="detail-section">
        <h4 class="detail-section-title">今日预订</h4>
        <div class="detail-booking-pills">
          ${dayBookings.map(b => `<span class="booking-pill">${b} →</span>`).join('')}
        </div>
      </div>` : ''}

      ${dayTips.length > 0 ? `
      <div class="detail-section">
        <h4 class="detail-section-title">今日提醒</h4>
        <div class="detail-tips">
          ${dayTips.map(tip => `<div class="tip-item">💡 ${tip}</div>`).join('')}
        </div>
      </div>` : ''}

      ${dayContent.length > 0 ? `
      <div class="detail-section">
        <h4 class="detail-section-title">种草内容</h4>
        <div class="related-content">
          ${dayContent.map(c => `
            <div class="related-card" style="border-left:3px solid ${c.color}">
              <div class="rc-header">
                <span class="rc-platform">${c.icon} ${c.platform}</span>
                <span class="rc-likes">❤️ ${c.likes}</span>
              </div>
              <p class="rc-title">${c.title}</p>
            </div>
          `).join('')}
        </div>
      </div>` : ''}
    `;
  }

  // === Render the detail view ===
  function renderDetailView(mode) {
    // mode: 'overview' or day index (0, 1, 2...)
    const isOverview = mode === 'overview';

    // Build view tabs
    const viewTabsHTML = `
      <div class="view-tabs-row">
        <button class="view-tab ${isOverview ? 'active' : ''}" data-mode="overview">📋 全览</button>
        ${plan.days.map((day, i) => `
          <button class="view-tab ${mode === i ? 'active' : ''}" data-mode="${i}">
            <span class="vt-day">${day.label}</span>
            <span class="vt-weather">${day.weather.icon}${day.weather.temp}</span>
          </button>
        `).join('')}
      </div>
    `;

    const contentHTML = isOverview ? buildOverviewHTML() : buildDayHTML(mode);

    detailBody.innerHTML = `
      <h2 class="detail-title">${plan.title}</h2>
      <p class="detail-transit">🚄 ${plan.transit} · ${plan.stayType} ${plan.price}</p>

      ${viewTabsHTML}

      <div id="detailContent">${contentHTML}</div>

      <div class="detail-cta">
        <button class="detail-cta-btn" data-id="${plan.id}">${savedIds.has(plan.id) ? '✓ 已收藏' : '❤️ 加入行程'}</button>
      </div>
    `;

    // Bind view tab clicks
    detailBody.querySelectorAll('.view-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const m = tab.dataset.mode;
        renderDetailView(m === 'overview' ? 'overview' : parseInt(m));
        // Scroll back to top of detail sheet
        document.getElementById('detailSheet').scrollTop = 0;
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
    if (isOverview) {
      renderDetailMap(plan);
    } else {
      // Render per-day map
      const dayPts = getDayRoutePoints(plan, mode);
      if (dayPts.length >= 2 && window.L) {
        setTimeout(() => {
          const mapEl = document.getElementById('dayRouteMap');
          if (!mapEl) return;
          const map = L.map(mapEl, { zoomControl: false, attributionControl: false });
          L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', { maxZoom: 18 }).addTo(map);
          const coords = dayPts.map(p => `${p.lng},${p.lat}`).join(';');
          fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`)
            .then(r => r.json())
            .then(data => {
              if (data.routes && data.routes[0]) {
                const rc = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
                L.polyline(rc, { color: '#FF6B4A', weight: 3, opacity: 0.85 }).addTo(map);
              }
            }).catch(() => {});
          dayPts.forEach((p, i) => {
            L.circleMarker([p.lat, p.lng], {
              radius: 6, fillColor: i === 0 ? '#4A90D9' : '#FF6B4A', color: '#fff', weight: 2, fillOpacity: 1
            }).addTo(map).bindTooltip(p.name, { permanent: true, direction: i % 2 === 0 ? 'top' : 'bottom', offset: [0, -8], className: 'map-label-sm' });
          });
          const pts = dayPts.map(p => [p.lat, p.lng]);
          map.fitBounds(pts, { padding: [40, 40], maxZoom: 13 });
        }, 300);
      }
    }
  }

  renderDetailView('overview');
  detailOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderDetailMap(plan) {
  if (!plan.route || plan.route.length <= 1 || !window.L) return;
  setTimeout(() => {
    const mapEl = document.getElementById('routeMap');
    if (!mapEl) return;
    const map = L.map(mapEl, { zoomControl: false, attributionControl: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', { maxZoom: 18 }).addTo(map);
    const pts = plan.route.map(p => [p.lat, p.lng]);
    const outCoords = plan.route.slice(0, -1).map(p => `${p.lng},${p.lat}`).join(';');
    fetch(`https://router.project-osrm.org/route/v1/driving/${outCoords}?overview=full&geometries=geojson`)
      .then(r => r.json())
      .then(data => {
        if (data.routes && data.routes[0]) {
          const rc = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
          L.polyline(rc, { color: '#FF6B4A', weight: 3, opacity: 0.85 }).addTo(map);
        }
      }).catch(() => {});
    const lastDest = plan.route[plan.route.length - 2];
    const home = plan.route[plan.route.length - 1];
    const retCoords = `${lastDest.lng},${lastDest.lat};${home.lng},${home.lat}`;
    fetch(`https://router.project-osrm.org/route/v1/driving/${retCoords}?overview=full&geometries=geojson`)
      .then(r => r.json())
      .then(data => {
        if (data.routes && data.routes[0]) {
          const rc = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
          L.polyline(rc, { color: '#4A90D9', weight: 2.5, opacity: 0.7, dashArray: '8,6' }).addTo(map);
        }
      }).catch(() => {});
    plan.route.forEach((p, i) => {
      L.circleMarker([p.lat, p.lng], {
        radius: 5, fillColor: '#FF6B4A', color: '#fff', weight: 2, fillOpacity: 1
      }).addTo(map).bindTooltip(p.name, { permanent: true, direction: ['top','right','left','bottom'][i % 4], offset: [0, -8], className: 'map-label-sm' });
    });
    if (plan.legs) {
      plan.legs.forEach((leg, i) => {
        if (i >= pts.length - 1) return;
        const midLat = (pts[i][0] + pts[i+1][0]) / 2;
        const midLng = (pts[i][1] + pts[i+1][1]) / 2;
        const from = plan.route[i];
        const to = plan.route[i+1];
        const navUrl = `https://uri.amap.com/navigation?from=${from.lng},${from.lat},${from.name}&to=${to.lng},${to.lat},${to.name}&mode=car`;
        L.marker([midLat, midLng], {
          icon: L.divIcon({ className: 'leg-label clickable', html: `<a href="${navUrl}" target="_blank">${leg}</a>`, iconSize: [60, 16], iconAnchor: [30, 8] })
        }).addTo(map);
      });
    }
    map.fitBounds(pts, { padding: [35, 35], maxZoom: 11 });
  }, 300);
}

function closeDetail() {
  detailOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

// === Shortlist Panel ===
function openShortlist() {
  const saved = PLANS.filter(p => savedIds.has(p.id));
  shortlistBody.innerHTML = saved.length === 0
    ? '<p class="panel-empty">还没收藏方案<br>看看有没有心动的？</p>'
    : saved.map(p => `
      <div class="sl-item" data-id="${p.id}">
        <img class="sl-img" src="${imgUrl(p.days[0].photo)}" alt="${p.title}">
        <div class="sl-info">
          <h4>${p.title}</h4>
          <p>${p.duration} · ${p.transit}</p>
        </div>
      </div>
    `).join('');
  shortlistOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  shortlistBody.querySelectorAll('.sl-item').forEach(el => {
    el.addEventListener('click', () => {
      const plan = PLANS.find(p => p.id === Number(el.dataset.id));
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
