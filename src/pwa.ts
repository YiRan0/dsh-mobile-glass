/**
 * dsh-mobile-glass — PWA surface constants (Host half).
 *
 * Served through webServer exact routes registered in src/index.ts:
 *  - SW_SOURCE        → /sw.js            (text/javascript, Cache-Control: no-cache)
 *  - MANIFEST_JSON    → /manifest.webmanifest (shadows the dist copy via exact-route priority)
 *  - HEAD_EXTRA       → injected into </head> by an index tap (apple-touch-icon,
 *                       theme-color, SW registration script)
 *  - OFFLINE_HTML     → embedded in the SW; shown when a navigation cannot reach
 *                       the server (honest offline page, not a fake offline shell)
 *
 * Cache policy (SW_SOURCE): only content-addressed URLs are ever cached —
 * /assets/* hash names and /plugins/*?rev= (rev is the SHA-1 of the bundle
 * content, so a changed bundle always gets a new URL and a stale entry can
 * never be served). /api/* and /plugins/events (SSE/HMR) are bypassed
 * entirely. Bump SW_VERSION on any policy change; the no-cache response header
 * lets the browser pick the new script up promptly.
 */

export const SW_VERSION = '20260817b'

export const MANIFEST_JSON = JSON.stringify({
  id: '/',
  name: 'DeepSeek Harness',
  short_name: 'DSH',
  description: 'DeepSeek Harness 移动端',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  orientation: 'portrait',
  theme_color: '#0f172a',
  background_color: '#0f172a',
  icons: [
    { src: '/pwa/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/pwa/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    { src: '/pwa/icon-180.png', sizes: '180x180', type: 'image/png', purpose: 'any' }
  ]
}, null, 2)

export const OFFLINE_HTML = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#0f172a">
<title>DSH · 离线</title>
<style>
  body{margin:0;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:#0f172a;color:#e2e8f0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;text-align:center;padding:24px}
  img{width:72px;height:72px;border-radius:18px}
  h1{font-size:18px;margin:0;font-weight:600}
  p{font-size:14px;color:#94a3b8;margin:0}
  button{margin-top:10px;padding:10px 28px;border:1px solid #334155;border-radius:12px;background:rgba(148,163,184,.12);color:#e2e8f0;font-size:14px;cursor:pointer;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
</style>
</head>
<body>
  <img src="/pwa/icon-192.png" alt="DSH">
  <h1>离线中</h1>
  <p>当前网络不可用，恢复后自动重连</p>
  <button onclick="location.reload()">重试</button>
</body>
</html>`

export const REGISTER_SCRIPT = `<script data-dsh-pwa>
(function () {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).catch(function () {});
  });
})();
</script>`

/** Fragment injected before </head> by the index tap (idempotent via data-dsh-pwa). */
export const HEAD_EXTRA = [
  '<link rel="apple-touch-icon" href="/pwa/icon-180.png">',
  '<meta name="theme-color" content="#0f172a">',
  REGISTER_SCRIPT
].join('\n    ')

export const SW_SOURCE = [
  "/* dsh-mobile-glass service worker — generated from src/pwa.ts */",
  "'use strict';",
  "var VERSION = " + JSON.stringify(SW_VERSION) + ";",
  "var CACHE = 'dsh-pwa-' + VERSION;",
  "var MAX_PRECACHE_BYTES = 5 * 1024 * 1024;",
  "var OFFLINE = " + JSON.stringify(OFFLINE_HTML) + ";",
  "var STATIC_URLS = [",
  "  '/manifest.webmanifest',",
  "  '/favicon.svg',",
  "  '/pwa/icon-192.png',",
  "  '/pwa/icon-512.png',",
  "  '/pwa/icon-180.png'",
  "];",
  "",
  "function collectUrls() {",
  "  return fetch('/', { cache: 'no-store' })",
  "    .then(function (res) { return res.text(); })",
  "    .then(function (html) {",
  "      var urls = [];",
  "      var re = /(?:src|href)=\"(\\/(?:assets|plugins)\\/[^\"]+)\"/g;",
  "      var m;",
  "      while ((m = re.exec(html))) urls.push(m[1]);",
  "      var re2 = /\"url\":\"(\\/plugins\\/[^\"]+)\"/g;",
  "      while ((m = re2.exec(html))) urls.push(m[1]);",
  "      return urls;",
  "    })",
  "    .catch(function () { return []; });",
  "}",
  "",
  "function sizeOk(url) {",
  "  return fetch(url, { method: 'HEAD' })",
  "    .then(function (res) {",
  "      var len = parseInt(res.headers.get('content-length') || '0', 10);",
  "      return !len || len <= MAX_PRECACHE_BYTES;",
  "    })",
  "    .catch(function () { return true; });",
  "}",
  "",
  "self.addEventListener('install', function (event) {",
  "  event.waitUntil(",
  "    Promise.all([",
  "      caches.open(CACHE).then(function (cache) {",
  "        var put = function (url) {",
  "          return fetch(url).then(function (res) {",
  "            if (res.ok) return cache.put(url, res);",
  "          }).catch(function () {});",
  "        };",
  "        var tasks = STATIC_URLS.map(put);",
  "        tasks.push(cache.put('/offline', new Response(OFFLINE, { headers: { 'content-type': 'text/html; charset=utf-8' } })));",
  "        return collectUrls().then(function (urls) {",
  "          return Promise.all(urls.map(function (u) {",
  "            return sizeOk(u).then(function (ok) { if (ok) return put(u); });",
  "          }));",
  "        });",
  "      }),",
  "      self.skipWaiting()",
  "    ])",
  "  );",
  "});",
  "",
  "self.addEventListener('activate', function (event) {",
  "  event.waitUntil(",
  "    caches.keys().then(function (keys) {",
  "      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));",
  "    }).then(function () { return self.clients.claim(); })",
  "  );",
  "});",
  "",
  "self.addEventListener('fetch', function (event) {",
  "  var req = event.request;",
  "  if (req.method !== 'GET') return;",
  "  var url = new URL(req.url);",
  "  if (url.origin !== self.location.origin) return;",
  "  var path = url.pathname;",
  "",
  "  /* 鉴权/实时/动态流量：完全旁路（不 respondWith，浏览器直连） */",
  "  if (path === '/api' || path.indexOf('/api/') === 0) return;",
  "  if (path === '/plugins/events') return;",
  "",
  "  /* 导航：stale-while-revalidate —— 立即返回缓存壳，后台刷新 index；",
  "     无缓存才走网络，仍失败回退离线页 */",
  "  if (req.mode === 'navigate') {",
  "    event.respondWith(",
  "      caches.open(CACHE).then(function (cache) {",
  "        return cache.match(req).then(function (cached) {",
  "          var network = fetch(req).then(function (res) {",
  "            if (res && res.ok) cache.put(req, res.clone());",
  "            return res;",
  "          }).catch(function () { return null; });",
  "          if (cached) {",
  "            network.then(function () {});",
  "            return cached;",
  "          }",
  "          return network.then(function (res) {",
  "            return res || caches.match('/offline');",
  "          });",
  "        });",
  "      })",
  "    );",
  "    return;",
  "  }",
  "",
  "  /* 内容寻址静态资源：cache-first + 后台更新 */",
  "  var cacheable = path.indexOf('/assets/') === 0",
  "    || (path.indexOf('/plugins/') === 0 && path.indexOf('/plugins/events') !== 0)",
  "    || path.indexOf('/pwa/') === 0",
  "    || path === '/manifest.webmanifest'",
  "    || path === '/favicon.svg';",
  "  if (!cacheable) return;",
  "",
  "  event.respondWith(",
  "    caches.open(CACHE).then(function (cache) {",
  "      return cache.match(req).then(function (cached) {",
  "        if (cached) {",
  "          fetch(req).then(function (res) {",
  "            if (res && res.ok) cache.put(req, res);",
  "          }).catch(function () {});",
  "          return cached;",
  "        }",
  "        return fetch(req).then(function (res) {",
  "          if (res && res.ok) cache.put(req, res.clone());",
  "          return res;",
  "        }).catch(function () {",
  "          return new Response('', { status: 503, statusText: 'Offline' });",
  "        });",
  "      });",
  "    })",
  "  );",
  "});"
].join('\n')
