/* Straßenbau-Trainer – Service Worker (offline). Bei Änderungen Versionsnummer erhöhen. */
var CACHE = 'strassenbau-trainer-v3';
var DATEIEN = ['./', './index.html', './styles.css', './inhalte.js', './inhalte-wiso.js', './inhalte-ergaenzung.js', './rechnen.js', './app.js', './manifest.webmanifest', './icon.svg'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(DATEIEN.map(function (u) { return c.add(new Request(u, { cache: 'reload' })).catch(function () {}); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (namen) {
    return Promise.all(namen.map(function (n) { if (n !== CACHE && n.indexOf('strassenbau-trainer-') === 0) return caches.delete(n); }));
  }).then(function () { return self.clients.claim(); }));
});

// Netzwerk zuerst (damit Updates ankommen), bei fehlendem Netz aus dem Speicher
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fetch(req).then(function (antwort) {
    if (antwort && antwort.ok) { var k = antwort.clone(); caches.open(CACHE).then(function (c) { c.put(req, k); }); }
    return antwort;
  }).catch(function () {
    return caches.match(req, { ignoreSearch: true }).then(function (t) {
      return t || (req.mode === 'navigate' ? caches.match('./index.html') : new Response('', { status: 504 }));
    });
  }));
});
