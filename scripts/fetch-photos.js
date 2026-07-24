const https = require("https");
const fs = require("fs");

const GPLACES_KEY = process.env.GPLACES_KEY;

// 提取核心景区名
function simplifyPOIName(name) {
  // 去掉子地点后缀
  let s = name.split("-")[0].split("(")[0].split("（")[0].split("·")[0].trim();
  // 去掉通用后缀：景区、风景名胜区、国家森林公园、旅游度假区等
  s = s.replace(/(风景名胜区|风景区|景区|国家森林公园|旅游度假区|主题公园|俱乐部|度假村)$/, "");
  // 如果还太长，取前6字
  if (s.length > 6) s = s.slice(0, 6);
  return s;
}

function searchPlacePhotos(query, lat, lng) {
  return new Promise((resolve) => {
    const body = JSON.stringify({
      textQuery: query,
      maxResultCount: 1
    });
    const options = {
      hostname: "keygate.kagura-agent.com",
      path: "/google-places/v1/places:searchText",
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GPLACES_KEY}`,
        "Content-Type": "application/json",
        "X-Goog-FieldMask": "places.displayName,places.photos,places.location",
        "Content-Length": Buffer.byteLength(body)
      }
    };
    const req = https.request(options, res => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => {
        try { resolve(JSON.parse(data).places?.[0] || null); }
        catch(e) { resolve(null); }
      });
    });
    req.on("error", () => resolve(null));
    req.write(body);
    req.end();
  });
}

function getPhotoUri(photoName) {
  return new Promise((resolve) => {
    const url = `/google-places/v1/${photoName}/media?maxWidthPx=800&skipHttpRedirect=true`;
    https.get({ hostname: "keygate.kagura-agent.com", path: url, headers: { "Authorization": `Bearer ${GPLACES_KEY}` } }, res => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => {
        try { resolve(JSON.parse(data).photoUri || null); }
        catch(e) { resolve(null); }
      });
    }).on("error", () => resolve(null));
  });
}

(async () => {
  const content = fs.readFileSync("./site/data-final.js", "utf8");
  const plans = JSON.parse(content.replace(/^const PLANS = /, "").replace(/;$/, ""));

  for (const plan of plans) {
    for (const day of plan.days) {
      const playStep = day.steps.find(s => s.type === "play" && s.place && s.place.name);
      if (!playStep) { console.log("❌ no play step"); continue; }

      const poiName = playStep.place.name;
      const simplified = simplifyPOIName(poiName);
      const lat = playStep.place.lat;
      const lng = playStep.place.lng;

      let result = await searchPlacePhotos(simplified, lat, lng);
      if (!result && simplified !== poiName) {
        result = await searchPlacePhotos(poiName, lat, lng);
      }

      if (result && result.photos && result.photos.length > 0) {
        const rLat = result.location?.latitude;
        if (rLat && Math.abs(rLat - (lat || 31.3)) < 2) {
          const uri = await getPhotoUri(result.photos[0].name);
          if (uri) {
            day.photo = uri;
            console.log("✅ " + poiName.slice(0,20) + " → " + result.displayName.text);
          } else {
            console.log("⚠️ " + poiName.slice(0,20) + " (uri failed)");
          }
        } else {
          console.log("❌ " + poiName.slice(0,20) + " → wrong loc (" + (rLat?.toFixed(1) || "?") + ")");
        }
      } else {
        console.log("❌ " + poiName.slice(0,20) + " → not found");
      }
      await new Promise(r => setTimeout(r, 600));
    }
  }

  fs.writeFileSync("./site/data-final.js", "const PLANS = " + JSON.stringify(plans, null, 2) + ";");
  const withPhoto = plans.reduce((a, p) => a + p.days.filter(d => d.photo && d.photo.startsWith("http")).length, 0);
  const total = plans.reduce((a, p) => a + p.days.length, 0);
  console.log("\nDone: " + withPhoto + "/" + total + " with verified photos");
})();
