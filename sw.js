const CACHE = 'gem-mobile-v1';
const HTML  = 'index.html';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.add(HTML)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.mode !== 'navigate') return;

  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(HTML);

      // Background revalidation — runs whether we serve from cache or not
      const revalidate = (async () => {
        try {
          const headers = {};
          const oldEtag = cached?.headers.get('ETag');
          if (oldEtag) headers['If-None-Match'] = oldEtag;

          const res = await fetch(HTML, { cache: 'no-cache', headers });

          if (res.status === 304) return cached; // not modified — nothing to do
          if (!res.ok)            return cached || res;

          const newEtag = res.headers.get('ETag');
          const changed = oldEtag && newEtag && oldEtag !== newEtag;

          await cache.put(HTML, res.clone());

          // Only notify when we can confirm via ETag that content actually changed
          // and we already served a (now-stale) cached response this navigation
          if (changed && cached) {
            const clients = await self.clients.matchAll({ type: 'window' });
            clients.forEach(c => c.postMessage({ type: 'UPDATE' }));
          }

          return res;
        } catch {
          return cached || new Response('Offline — no cached version available.', { status: 503 });
        }
      })();

      // Serve cache instantly; wait for network only on first visit (no cache yet)
      return cached ?? revalidate;
    })
  );
});
