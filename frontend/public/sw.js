/**
 * Service Worker for caching and offline functionality
 */

const CACHE_NAME = 'mystic-host-v1';
const STATIC_CACHE = 'mystic-host-static-v1';
const DYNAMIC_CACHE = 'mystic-host-dynamic-v1';
const API_CACHE = 'mystic-host-api-v1';

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/servers',
  '/api/pricing-plans',
  '/api/testimonials'
];

// Cache duration in milliseconds
const CACHE_DURATION = {
  STATIC: 7 * 24 * 60 * 60 * 1000, // 7 days
  API: 5 * 60 * 1000, // 5 minutes
  DYNAMIC: 24 * 60 * 60 * 1000 // 24 hours
};

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete old caches
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== API_CACHE) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  if (request.destination === 'script' || 
      request.destination === 'style' || 
      request.destination === 'image') {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // Handle other requests with dynamic cache
  event.respondWith(handleDynamicRequest(request));
});

/**
 * Handle API requests with cache-first strategy for certain endpoints
 */
async function handleApiRequest(request) {
  const url = new URL(request.url);
  const cacheable = API_ENDPOINTS.some(endpoint => url.pathname.includes(endpoint));

  if (cacheable && request.method === 'GET') {
    try {
      const cache = await caches.open(API_CACHE);
      const cachedResponse = await cache.match(request);
      
      if (cachedResponse && !isExpired(cachedResponse, CACHE_DURATION.API)) {
        console.log('Service Worker: Returning cached API response', url.pathname);
        return cachedResponse;
      }

      // Fetch from network
      const networkResponse = await fetch(request);
      
      if (networkResponse.ok) {
        // Add timestamp header for expiration checking
        const responseToCache = networkResponse.clone();
        const headers = new Headers(responseToCache.headers);
        headers.set('sw-cached-at', Date.now().toString());
        
        const modifiedResponse = new Response(responseToCache.body, {
          status: responseToCache.status,
          statusText: responseToCache.statusText,
          headers
        });
        
        cache.put(request, modifiedResponse);
        console.log('Service Worker: Cached API response', url.pathname);
      }
      
      return networkResponse;
    } catch (error) {
      console.log('Service Worker: Network failed, trying cache', error);
      const cache = await caches.open(API_CACHE);
      const cachedResponse = await cache.match(request);
      return cachedResponse || new Response('Network error', { status: 503 });
    }
  }

  // For non-cacheable API requests, go directly to network
  return fetch(request);
}

/**
 * Handle static assets with cache-first strategy
 */
async function handleStaticRequest(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse && !isExpired(cachedResponse, CACHE_DURATION.STATIC)) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      const headers = new Headers(responseToCache.headers);
      headers.set('sw-cached-at', Date.now().toString());
      
      const modifiedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers
      });
      
      cache.put(request, modifiedResponse);
    }
    
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Network error', { status: 503 });
  }
}

/**
 * Handle navigation requests (SPA routing)
 */
async function handleNavigationRequest(request) {
  try {
    // Try network first for navigation
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    // Fallback to cached index.html for SPA routing
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match('/');
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

/**
 * Handle other dynamic requests
 */
async function handleDynamicRequest(request) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse && !isExpired(cachedResponse, CACHE_DURATION.DYNAMIC)) {
      // Return cache and update in background
      fetch(request).then(response => {
        if (response.ok) {
          const responseToCache = response.clone();
          const headers = new Headers(responseToCache.headers);
          headers.set('sw-cached-at', Date.now().toString());
          
          const modifiedResponse = new Response(responseToCache.body, {
            status: responseToCache.status,
            statusText: responseToCache.statusText,
            headers
          });
          
          cache.put(request, modifiedResponse);
        }
      }).catch(() => {});
      
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      const headers = new Headers(responseToCache.headers);
      headers.set('sw-cached-at', Date.now().toString());
      
      const modifiedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers
      });
      
      cache.put(request, modifiedResponse);
    }
    
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Network error', { status: 503 });
  }
}

/**
 * Check if cached response is expired
 */
function isExpired(response, maxAge) {
  const cachedAt = response.headers.get('sw-cached-at');
  if (!cachedAt) return true;
  
  const age = Date.now() - parseInt(cachedAt);
  return age > maxAge;
}

/**
 * Message handling for cache management
 */
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CLEAR_CACHE':
      clearCache(payload?.cacheNames);
      break;
      
    case 'CACHE_API_RESPONSE':
      cacheApiResponse(payload?.url, payload?.data);
      break;
      
    case 'GET_CACHE_SIZE':
      getCacheSize().then(size => {
        event.ports[0].postMessage({ size });
      });
      break;
  }
});

/**
 * Clear specified caches or all caches
 */
async function clearCache(cacheNames = []) {
  if (cacheNames.length === 0) {
    const allCaches = await caches.keys();
    await Promise.all(allCaches.map(cacheName => caches.delete(cacheName)));
  } else {
    await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
  }
}

/**
 * Manually cache API response
 */
async function cacheApiResponse(url, data) {
  const cache = await caches.open(API_CACHE);
  const response = new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'sw-cached-at': Date.now().toString()
    }
  });
  await cache.put(url, response);
}

/**
 * Get total cache size
 */
async function getCacheSize() {
  const cacheNames = await caches.keys();
  let totalSize = 0;
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }
  
  return totalSize;
}