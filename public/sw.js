/**
 * GonePal Nepal - Trekker's Ghost Mode Service Worker
 * Provides offline functionality for high-altitude trekkers in Nepal
 * 
 * Cache-First Strategy: Checks local cache before network
 */

const CACHE_NAME = 'gonepal-v2';

// Assets to cache for offline use - critical UI and navigation
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/gonepallogo.png',
  '/apple-touch-icon.png',
  '/favicon.ico',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/placeholder.svg',
  '/robots.txt',
  '/site.webmanifest',
];

// Nepal trekking regions to pre-cache (Everest, Annapurna, Langtang)
// Format: zoom/x/y.png
const NEPAL_TILES = [
  // Everest Region (roughly z=10-14)
  'https://a.tile.openstreetmap.org/10/920/510.png',
  'https://a.tile.openstreetmap.org/10/921/510.png',
  'https://a.tile.openstreetmap.org/10/920/511.png',
  'https://a.tile.openstreetmap.org/10/921/511.png',
  'https://a.tile.openstreetmap.org/11/1840/1020.png',
  'https://a.tile.openstreetmap.org/11/1841/1020.png',
  'https://a.tile.openstreetmap.org/11/1840/1021.png',
  'https://a.tile.openstreetmap.org/11/1841/1021.png',
  'https://a.tile.openstreetmap.org/12/3680/2040.png',
  'https://a.tile.openstreetmap.org/12/3681/2040.png',
  'https://a.tile.openstreetmap.org/12/3680/2041.png',
  'https://a.tile.openstreetmap.org/12/3681/2041.png',
  'https://a.tile.openstreetmap.org/13/7360/4080.png',
  'https://a.tile.openstreetmap.org/13/7361/4080.png',
  'https://a.tile.openstreetmap.org/13/7360/4081.png',
  'https://a.tile.openstreetmap.org/13/7361/4081.png',
  // Kathmandu Valley
  'https://a.tile.openstreetmap.org/12/1824/2524.png',
  'https://a.tile.openstreetmap.org/12/1825/2524.png',
  'https://a.tile.openstreetmap.org/12/1824/2525.png',
  'https://a.tile.openstreetmap.org/12/1825/2525.png',
  'https://a.tile.openstreetmap.org/13/3648/5048.png',
  'https://a.tile.openstreetmap.org/13/3649/5048.png',
  'https://a.tile.openstreetmap.org/13/3648/5049.png',
  'https://a.tile.openstreetmap.org/13/3649/5049.png',
  // Pokhara
  'https://a.tile.openstreetmap.org/11/1756/1094.png',
  'https://a.tile.openstreetmap.org/11/1757/1094.png',
  'https://a.tile.openstreetmap.org/11/1756/1095.png',
  'https://a.tile.openstreetmap.org/11/1757/1095.png',
];

// Install event - cache all assets + Nepal map tiles
self.addEventListener('install', (event) => {
  console.log('[Ghost Mode] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Ghost Mode] Caching all assets for offline use');
      // Cache app assets
      const assetPromise = cache.addAll(ASSETS_TO_CACHE);
      // Cache Nepal tiles in background
      const tilePromise = cache.addAll(NEPAL_TILES).catch(e => 
        console.log('[Ghost Mode] Some tiles failed to cache (ok)')
      );
      return Promise.all([assetPromise, tilePromise]);
    })
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Ghost Mode] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[Ghost Mode] Clearing old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  // Take control immediately
  self.clients.claim();
});

// Fetch event - Cache-First Strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle map tiles - cache on first load, serve from cache on offline
  if (url.hostname.includes('tile.openstreetmap.org')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Not in cache, fetch from network and cache it
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Return a placeholder for missing tiles
            return new Response('', { status: 404 });
          });
        });
      })
    );
    return;
  }

  // Skip cross-origin requests except for navigation
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html');
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version if available
      if (response) {
        console.log('[Ghost Mode] Serving from cache:', event.request.url);
        return response;
      }

      // Otherwise fetch from network and cache the result
      return fetch(event.request).then((networkResponse) => {
        // Only cache GET requests
        if (event.request.method === 'GET' && networkResponse) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Return offline fallback for images
        if (event.request.destination === 'image') {
          return caches.match('/gonepallogo.png');
        }
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});

// Handle messages from the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
