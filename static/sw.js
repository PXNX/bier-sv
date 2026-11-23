/* Hopnote service worker — cached shell, offline beer lookups and local notifications. */
const VERSION = 'hopnote-v2';
const SHELL_CACHE = `${VERSION}-shell`;
const DATA_CACHE = `${VERSION}-data`;

const SHELL = [
  '/',
  '/index.html',
  '/404.html',
  '/500.html',
  '/discover.html',
  '/journal.html',
  '/saved.html',
  '/insights.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/favicon-32.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
];

const OFF_API = /^https:\/\/world\.openfoodfacts\.org\/api\//;
const OFF_IMAGE = /^https:\/\/images\.openfoodfacts\.org\//;
const MAX_DATA_ENTRIES = 120;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then(async (cache) => {
      // One bad URL must not prevent the whole shell from being cached.
      await Promise.all(SHELL.map((url) => cache.add(url).catch(() => {})));
      await self.skipWaiting();
    }),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('hopnote-') && key !== SHELL_CACHE && key !== DATA_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'skip-waiting') self.skipWaiting();
});

async function trim(cache, max = MAX_DATA_ENTRIES) {
  const keys = await cache.keys();
  if (keys.length > max) {
    await Promise.all(keys.slice(0, keys.length - max).map((key) => cache.delete(key)));
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then(async (response) => {
      if (response && response.ok) {
        await cache.put(request, response.clone());
        if (cacheName === DATA_CACHE) await trim(cache);
      }
      return response;
    })
    .catch(() => cached);
  return cached || network;
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && response.ok) {
    await cache.put(request, response.clone());
    await trim(cache);
  }
  return response;
}

async function navigate(request) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const response = await fetch(request);
    if (response && response.ok) await cache.put('/index.html', response.clone());
    return response;
  } catch {
    return (
      (await cache.match(request)) || (await cache.match('/index.html')) || (await cache.match('/404.html'))
    );
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const target = `${url.origin}${url.pathname}`;

  // Product lookups and bottle photos survive a flaky connection or offline mode.
  if (OFF_API.test(target) || OFF_IMAGE.test(target)) {
    const promise = OFF_IMAGE.test(target)
      ? cacheFirst(request, DATA_CACHE)
      : staleWhileRevalidate(request, DATA_CACHE);
    event.waitUntil(promise);
    event.respondWith(promise);
    return;
  }

  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    const promise = navigate(request);
    event.waitUntil(promise);
    event.respondWith(promise);
    return;
  }

  const promise = staleWhileRevalidate(request, SHELL_CACHE);
  event.waitUntil(promise);
  event.respondWith(promise);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      const open = windows.find((client) => 'focus' in client);
      return open ? open.focus() : clients.openWindow('/');
    }),
  );
});

self.addEventListener('periodicSync', (event) => {
  if (event.tag !== 'hopnote-reminder') return;
  event.waitUntil(
    self.registration
      .showNotification('A little tasting reminder', {
        body: 'Open Hopnote and note what is in your glass today.',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag: 'hopnote-daily-reminder',
      })
      .catch(() => {}),
  );
});
