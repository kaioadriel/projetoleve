const CACHE_VERSION = 'projeto-leve-v20-calorias-composicao';
const RUNTIME_CACHE = 'projeto-leve-runtime-v20-calorias-composicao';
const BASE = new URL('./', self.location.href);
const localUrl = name => new URL(name, BASE).href;
const APP_SHELL = ['./', 'index.html', 'manifest.json', 'icons/icon-192.png', 'icons/icon-512.png'].map(localUrl);
const DEPENDENCIAS = [
  'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js',
  'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js'
];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const shell = await caches.open(CACHE_VERSION);
    await shell.addAll(APP_SHELL);
    const runtime = await caches.open(RUNTIME_CACHE);
    await Promise.allSettled(DEPENDENCIAS.map(async url => {
      const response = await fetch(url, { mode: 'cors' });
      if (response.ok) await runtime.put(url, response);
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => /^projeto-leve-(v|runtime-v)/.test(key) && key !== CACHE_VERSION && key !== RUNTIME_CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin === BASE.origin && request.mode === 'navigate') {
    event.respondWith((async () => {
      const runtime = await caches.open(RUNTIME_CACHE), shell = await caches.open(CACHE_VERSION);
      try {
        const response = await fetch(request);
        if (!response.ok) throw new Error('HTTP ' + response.status);
        if ((response.headers.get('content-type') || '').includes('text/html')) {
          const saving = Promise.all([
            runtime.put(request, response.clone()),
            runtime.put(localUrl('index.html'), response.clone()),
            runtime.put(localUrl('./'), response.clone())
          ]);
          event.waitUntil(saving.catch(() => {}));
          await saving.catch(() => {});
        }
        return response;
      } catch {
        return (await runtime.match(request)) || (await runtime.match(localUrl('index.html'))) ||
          (await shell.match(request)) || (await shell.match(localUrl('index.html'))) ||
          new Response('Abra o aplicativo com internet uma vez para preparar o modo offline.', { status: 503, headers: { 'content-type': 'text/plain;charset=utf-8' } });
      }
    })());
    return;
  }
  const estatico = ['script', 'style', 'image', 'font'].includes(request.destination);
  if (!estatico || (url.origin !== BASE.origin && !DEPENDENCIAS.includes(url.href))) return;
  event.respondWith((async () => {
    const runtime = await caches.open(RUNTIME_CACHE), shell = await caches.open(CACHE_VERSION);
    const cached = (await runtime.match(request)) || (await shell.match(request));
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok) event.waitUntil(runtime.put(request, response.clone()).catch(() => {}));
    return response;
  })());
});
