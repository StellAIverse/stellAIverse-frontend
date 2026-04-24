const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE = `stellaiverse-static-${CACHE_VERSION}`;
const API_CACHE = `stellaiverse-api-${CACHE_VERSION}`;
const IMAGE_CACHE = `stellaiverse-images-${CACHE_VERSION}`;
const FONT_CACHE = `stellaiverse-fonts-${CACHE_VERSION}`;

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/_next/static/css/app/globals.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName.startsWith('stellaiverse-') && 
                     !cacheName.includes(CACHE_VERSION);
            })
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement aggressive caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests except for specific domains
  if (!url.origin.includes(self.location.origin) && 
      !url.hostname.includes('fonts.googleapis.com') && 
      !url.hostname.includes('fonts.gstatic.com') &&
      !url.hostname.includes('localhost')) {
    return;
  }

  event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // API calls - Network First with cache fallback
    if (url.pathname.includes('/api/')) {
      return await handleNetworkFirst(request, API_CACHE, 24 * 60 * 60); // 24 hours
    }
    
    // Static assets (JS, CSS, HTML) - Stale While Revalidate
    if (/\.(js|css|html|json)$/.test(url.pathname)) {
      return await handleStaleWhileRevalidate(request, STATIC_CACHE, 30 * 24 * 60 * 60); // 30 days
    }
    
    // Images - Cache First
    if (/\.(png|jpg|jpeg|svg|gif|webp|ico)$/.test(url.pathname)) {
      return await handleCacheFirst(request, IMAGE_CACHE, 90 * 24 * 60 * 60); // 90 days
    }
    
    // Fonts - Cache First
    if (/\.(woff|woff2|ttf|eot)$/.test(url.pathname) || 
        url.hostname.includes('fonts.googleapis.com') || 
        url.hostname.includes('fonts.gstatic.com')) {
      return await handleCacheFirst(request, FONT_CACHE, 365 * 24 * 60 * 60); // 1 year
    }
    
    // Default - Network First
    return await handleNetworkFirst(request, STATIC_CACHE, 24 * 60 * 60); // 24 hours
    
  } catch (error) {
    console.error('[SW] Error handling request:', error);
    return new Response('Service worker error', { status: 500 });
  }
}

// Network First strategy
async function handleNetworkFirst(request, cacheName, maxAgeSeconds) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the successful response
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, return cached version if available
    if (cachedResponse) {
      console.log('[SW] Network failed, returning cached response');
      return cachedResponse;
    }
    
    // No cache available, return offline page
    return new Response('Offline - No cached version available', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Stale While Revalidate strategy
async function handleStaleWhileRevalidate(request, cacheName, maxAgeSeconds) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Always try to update the cache in the background
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    console.log('[SW] Background fetch failed');
  });
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // If no cache, wait for network
  return await fetchPromise;
}

// Cache First strategy
async function handleCacheFirst(request, cacheName, maxAgeSeconds) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Check if cache is still valid (simple check based on age)
    const dateHeader = cachedResponse.headers.get('date');
    if (dateHeader) {
      const cacheDate = new Date(dateHeader);
      const now = new Date();
      const ageSeconds = (now - cacheDate) / 1000;
      
      if (ageSeconds < maxAgeSeconds) {
        return cachedResponse;
      }
    }
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, return stale cache if available
    if (cachedResponse) {
      console.log('[SW] Network failed, returning stale cache');
      return cachedResponse;
    }
    
    throw error;
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('[SW] Performing background sync');
  // Implement background sync logic here
}

// Push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    
    event.waitUntil(
      self.registration.showNotification('stellAIverse', options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click received');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});
