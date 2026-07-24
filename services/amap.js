/**
 * 高德地图服务封装
 * 
 * 提供 POI 搜索、路线规划、天气查询能力
 * Key 从 pass 管理，不硬编码
 * 
 * 使用: const amap = require('./amap');
 */

const https = require('https');

const BASE_URL = 'https://keygate.kagura-agent.com/amap/v3';

// Key is the keygate bearer token
let API_KEY = process.env.AMAP_KEY || '';

function setKey(key) {
  API_KEY = key;
}

function request(path, params) {
  return new Promise((resolve, reject) => {
    const query = new URLSearchParams({ output: 'json', ...params }).toString();
    const url = `${BASE_URL}${path}?${query}`;
    https.get(url, { headers: { 'Authorization': `Bearer ${API_KEY}` } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.status === '1') resolve(json);
          else reject(new Error(`Amap error: ${json.info || json.infocode}`));
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

/**
 * POI 关键词搜索
 * @param {string} keyword - 搜索关键词（如 "莫干山风景区南门"）
 * @param {object} opts - { city, types, offset, page }
 * @returns {Array} POI 列表 [{ id, name, type, location: {lat, lng}, address, tel }]
 */
async function searchPOI(keyword, opts = {}) {
  const params = { keywords: keyword };
  if (opts.city) params.city = opts.city;
  if (opts.types) params.types = opts.types;
  if (opts.citylimit) params.citylimit = 'true';
  params.offset = opts.offset || 10;
  params.page = opts.page || 1;

  const data = await request('/place/text', params);
  return (data.pois || []).map(poi => ({
    id: poi.id,
    name: poi.name,
    type: poi.type,
    address: poi.address || '',
    tel: poi.tel || '',
    location: parseLocation(poi.location),
    photos: (poi.photos || []).map(p => p.url).filter(Boolean),
    rating: poi.biz_ext?.rating || null,
    opentime: poi.biz_ext?.opentime2 || poi.biz_ext?.open_time || null
  }));
}

/**
 * 周边搜索
 * @param {object} center - { lat, lng }
 * @param {string} keyword - 搜索关键词
 * @param {number} radius - 搜索半径（米），默认 3000
 * @returns {Array} POI 列表
 */
async function searchNearby(center, keyword, radius = 3000) {
  const params = {
    location: `${center.lng},${center.lat}`,
    keywords: keyword,
    radius
  };
  const data = await request('/place/around', params);
  return (data.pois || []).map(poi => ({
    id: poi.id,
    name: poi.name,
    type: poi.type,
    address: poi.address || '',
    location: parseLocation(poi.location),
    distance: parseInt(poi.distance || '0')
  }));
}

/**
 * 公交/高铁路线规划
 * @param {object} origin - { lat, lng }
 * @param {object} destination - { lat, lng }
 * @returns {object} { duration(min), durationText, cost, segments }
 */
async function getTransitRoute(origin, destination) {
  const params = {
    origin: `${origin.lng},${origin.lat}`,
    destination: `${destination.lng},${destination.lat}`,
    city: '苏州',
    cityd: '苏州'
  };
  try {
    const data = await request('/direction/transit/integrated', params);
    const transit = data.route.transits[0];
    if (!transit) return null;
    return {
      duration: Math.round(parseInt(transit.duration) / 60),
      durationText: formatDuration(parseInt(transit.duration)),
      cost: transit.cost || '0',
      walking: Math.round(parseInt(transit.walking_distance || '0') / 1000 * 10) / 10
    };
  } catch(e) { return null; }
}

/**
 * 驾车路线规划
 * @param {object} origin - { lat, lng } 出发点
 * @param {object} destination - { lat, lng } 目的地
 * @param {object} opts - { strategy } 路线策略 0=最快
 * @returns {object} { distance(km), duration(min), polyline }
 */
async function getRoute(origin, destination, opts = {}) {
  const params = {
    origin: `${origin.lng},${origin.lat}`,
    destination: `${destination.lng},${destination.lat}`,
    strategy: opts.strategy || 0
  };
  const data = await request('/direction/driving', params);
  const path = data.route.paths[0];
  return {
    distance: Math.round(parseInt(path.distance) / 1000 * 10) / 10,  // km
    duration: Math.round(parseInt(path.duration) / 60),  // 分钟
    durationText: formatDuration(parseInt(path.duration)),
    tollDistance: Math.round(parseInt(path.tolls_distance || '0') / 1000),
    trafficLights: parseInt(path.traffic_lights || '0')
  };
}

/**
 * 天气查询（未来几天预报）
 * @param {string} city - 城市名或 adcode（如 "330521" 德清县）
 * @returns {object} { city, forecasts: [{ date, week, dayWeather, nightWeather, dayTemp, nightTemp, wind }] }
 */
async function getWeather(city) {
  const params = { city, extensions: 'all' };
  const data = await request('/weather/weatherInfo', params);
  const forecast = data.forecasts[0];
  return {
    city: forecast.city,
    adcode: forecast.adcode,
    forecasts: forecast.casts.map(c => ({
      date: c.date,
      week: ['日', '一', '二', '三', '四', '五', '六'][parseInt(c.week) % 7],
      dayWeather: c.dayweather,
      nightWeather: c.nightweather,
      dayTemp: parseInt(c.daytemp),
      nightTemp: parseInt(c.nighttemp),
      dayWind: `${c.daywind}风${c.daypower}级`,
    }))
  };
}

/**
 * 天气查询（实时）
 * @param {string} city - 城市名或 adcode
 * @returns {object} { weather, temperature, humidity, windDirection, windPower }
 */
async function getWeatherNow(city) {
  const params = { city, extensions: 'base' };
  const data = await request('/weather/weatherInfo', params);
  const live = data.lives[0];
  return {
    weather: live.weather,
    temperature: parseInt(live.temperature),
    humidity: parseInt(live.humidity),
    windDirection: live.winddirection,
    windPower: live.windpower
  };
}

// === Helpers ===

function parseLocation(locStr) {
  if (!locStr) return null;
  const [lng, lat] = locStr.split(',').map(Number);
  return { lat, lng };
}

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (h === 0) return `${m}分钟`;
  if (m === 0) return `${h}小时`;
  return `${h}小时${m}分钟`;
}

module.exports = {
  setKey,
  searchPOI,
  searchNearby,
  getRoute,
  getTransitRoute,
  getWeather,
  getWeatherNow
};
