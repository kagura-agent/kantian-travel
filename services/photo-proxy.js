/**
 * Google Places Photo Proxy
 * 
 * 部署在 VM1（日本），中转 Google Places API 请求
 * 其他服务通过这个代理拿照片，不需要直连 Google
 * 
 * API:
 *   GET /search?query=莫干山大竹海&fields=place_id,name,photos
 *   GET /photo?ref=<photo_reference>&maxwidth=800
 *   GET /photos?query=莫干山大竹海&maxwidth=800&limit=5
 * 
 * 需要 Bearer token 访问（环境变量 PROXY_TOKEN）
 * 
 * 环境变量:
 *   GOOGLE_PLACES_KEY - Google Places API key
 *   PROXY_TOKEN - 访问此服务的 token
 *   PORT - 监听端口（默认 3600）
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

const GOOGLE_KEY = process.env.GOOGLE_PLACES_KEY;
const PROXY_TOKEN = process.env.PROXY_TOKEN;
const PORT = parseInt(process.env.PORT || '3600');

if (!GOOGLE_KEY) { console.error('Missing GOOGLE_PLACES_KEY'); process.exit(1); }
if (!PROXY_TOKEN) { console.error('Missing PROXY_TOKEN'); process.exit(1); }

// === Helpers ===

function googleFetch(path) {
  return new Promise((resolve, reject) => {
    const url = `https://maps.googleapis.com${path}`;
    https.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        // Photo API redirects to actual image
        resolve({ redirect: res.headers.location, statusCode: res.statusCode });
        res.resume();
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ body: data, statusCode: res.statusCode, contentType: res.headers['content-type'] }));
    }).on('error', reject);
  });
}

function googleFetchBinary(url) {
  return new Promise((resolve, reject) => {
    const getter = url.startsWith('https') ? https : http;
    getter.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        // Follow redirect
        return googleFetchBinary(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve({ 
        buffer: Buffer.concat(chunks), 
        contentType: res.headers['content-type'],
        statusCode: res.statusCode 
      }));
    }).on('error', reject);
  });
}

function json(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function checkAuth(req, res) {
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${PROXY_TOKEN}`) {
    json(res, 401, { error: 'Unauthorized' });
    return false;
  }
  return true;
}

// === Routes ===

async function handleSearch(req, res, params) {
  const query = params.get('query');
  if (!query) return json(res, 400, { error: 'Missing query param' });

  const fields = params.get('fields') || 'place_id,name,photos,formatted_address';
  const path = `/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=${fields}&key=${GOOGLE_KEY}`;
  
  try {
    const result = await googleFetch(path);
    res.writeHead(result.statusCode, { 'Content-Type': 'application/json' });
    res.end(result.body);
  } catch (e) {
    json(res, 500, { error: e.message });
  }
}

async function handlePhoto(req, res, params) {
  const ref = params.get('ref');
  if (!ref) return json(res, 400, { error: 'Missing ref param' });

  const maxwidth = params.get('maxwidth') || '800';
  const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photo_reference=${ref}&key=${GOOGLE_KEY}`;

  try {
    const result = await googleFetchBinary(photoUrl);
    res.writeHead(200, { 
      'Content-Type': result.contentType || 'image/jpeg',
      'Cache-Control': 'public, max-age=86400'
    });
    res.end(result.buffer);
  } catch (e) {
    json(res, 500, { error: e.message });
  }
}

async function handlePhotos(req, res, params) {
  const query = params.get('query');
  if (!query) return json(res, 400, { error: 'Missing query param' });

  const limit = parseInt(params.get('limit') || '5');
  const maxwidth = params.get('maxwidth') || '800';

  try {
    // Step 1: Search for place
    const fields = 'place_id,name,photos';
    const searchPath = `/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=${fields}&key=${GOOGLE_KEY}`;
    const searchResult = await googleFetch(searchPath);
    const data = JSON.parse(searchResult.body);

    if (data.status !== 'OK' || !data.candidates?.length) {
      return json(res, 404, { error: 'Place not found', status: data.status });
    }

    const place = data.candidates[0];
    const photos = (place.photos || []).slice(0, limit);

    // Step 2: Return photo metadata with proxy URLs
    const photoList = photos.map((p, i) => ({
      index: i,
      width: p.width,
      height: p.height,
      attribution: p.html_attributions?.[0] || '',
      url: `/photo?ref=${encodeURIComponent(p.photo_reference)}&maxwidth=${maxwidth}`
    }));

    json(res, 200, {
      place_id: place.place_id,
      name: place.name,
      photos: photoList
    });
  } catch (e) {
    json(res, 500, { error: e.message });
  }
}

// === Server ===

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;
  const params = url.searchParams;

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // Auth check
  if (!checkAuth(req, res)) return;

  try {
    if (path === '/search') await handleSearch(req, res, params);
    else if (path === '/photo') await handlePhoto(req, res, params);
    else if (path === '/photos') await handlePhotos(req, res, params);
    else if (path === '/health') json(res, 200, { status: 'ok' });
    else json(res, 404, { error: 'Not found' });
  } catch (e) {
    json(res, 500, { error: e.message });
  }
});

server.listen(PORT, () => {
  console.log(`Google Places Photo Proxy running on :${PORT}`);
});
