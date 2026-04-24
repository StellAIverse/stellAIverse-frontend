interface CacheConfig {
  name: string;
  version: string;
  maxAge: number; // in seconds
  maxEntries: number;
}

interface CacheEntry {
  url: string;
  timestamp: number;
  response: Response;
}

class CacheManager {
  private static instance: CacheManager;
  private cacheConfigs: Map<string, CacheConfig> = new Map();

  private constructor() {
    this.initializeCacheConfigs();
  }

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  private initializeCacheConfigs() {
    this.cacheConfigs.set('static', {
      name: 'stellaiverse-static',
      version: 'v1.0.0',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      maxEntries: 200,
    });

    this.cacheConfigs.set('api', {
      name: 'stellaiverse-api',
      version: 'v1.0.0',
      maxAge: 24 * 60 * 60, // 24 hours
      maxEntries: 100,
    });

    this.cacheConfigs.set('images', {
      name: 'stellaiverse-images',
      version: 'v1.0.0',
      maxAge: 90 * 24 * 60 * 60, // 90 days
      maxEntries: 500,
    });

    this.cacheConfigs.set('fonts', {
      name: 'stellaiverse-fonts',
      version: 'v1.0.0',
      maxAge: 365 * 24 * 60 * 60, // 1 year
      maxEntries: 50,
    });
  }

  public async getCacheKey(type: string, url: string): Promise<string> {
    const config = this.cacheConfigs.get(type);
    if (!config) {
      throw new Error(`Unknown cache type: ${type}`);
    }
    return `${config.name}-${config.version}-${url}`;
  }

  public async cacheResponse(type: string, request: Request, response: Response): Promise<void> {
    const config = this.cacheConfigs.get(type);
    if (!config) {
      throw new Error(`Unknown cache type: ${type}`);
    }

    const cache = await caches.open(config.name);
    const cacheKey = await this.getCacheKey(type, request.url);
    
    // Add timestamp to response headers for age checking
    const responseClone = response.clone();
    const headers = new Headers(responseClone.headers);
    headers.set('sw-cached-at', Date.now().toString());
    
    const modifiedResponse = new Response(responseClone.body, {
      status: responseClone.status,
      statusText: responseClone.statusText,
      headers: headers,
    });

    await cache.put(request, modifiedResponse);
    
    // Clean up old entries if cache is full
    await this.cleanupCache(config.name, config.maxEntries);
  }

  public async getCachedResponse(type: string, request: Request): Promise<Response | null> {
    const config = this.cacheConfigs.get(type);
    if (!config) {
      throw new Error(`Unknown cache type: ${type}`);
    }

    const cache = await caches.open(config.name);
    const cachedResponse = await cache.match(request);
    
    if (!cachedResponse) {
      return null;
    }

    // Check if cache entry is still valid
    const cachedAt = cachedResponse.headers.get('sw-cached-at');
    if (cachedAt) {
      const cacheAge = (Date.now() - parseInt(cachedAt)) / 1000;
      if (cacheAge > config.maxAge) {
        // Cache is expired, remove it
        await cache.delete(request);
        return null;
      }
    }

    return cachedResponse;
  }

  public async clearCache(type?: string): Promise<void> {
    if (type) {
      const config = this.cacheConfigs.get(type);
      if (config) {
        const cache = await caches.open(config.name);
        await cache.keys().then(keys => {
          return Promise.all(keys.map(key => cache.delete(key)));
        });
      }
    } else {
      // Clear all caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(name => name.startsWith('stellaiverse-'))
          .map(name => caches.delete(name))
      );
    }
  }

  public async getCacheStats(): Promise<Record<string, any>> {
    const stats: Record<string, any> = {};
    
    for (const [type, config] of this.cacheConfigs) {
      const cache = await caches.open(config.name);
      const keys = await cache.keys();
      
      let totalSize = 0;
      let oldestEntry = Date.now();
      let newestEntry = 0;
      
      for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
          const cachedAt = response.headers.get('sw-cached-at');
          if (cachedAt) {
            const timestamp = parseInt(cachedAt);
            oldestEntry = Math.min(oldestEntry, timestamp);
            newestEntry = Math.max(newestEntry, timestamp);
          }
          
          // Estimate size (rough calculation)
          const responseClone = response.clone();
          const text = await responseClone.text();
          totalSize += text.length;
        }
      }
      
      stats[type] = {
        name: config.name,
        entries: keys.length,
        maxEntries: config.maxEntries,
        estimatedSize: totalSize,
        oldestEntry: oldestEntry === Date.now() ? null : new Date(oldestEntry),
        newestEntry: newestEntry === 0 ? null : new Date(newestEntry),
      };
    }
    
    return stats;
  }

  private async cleanupCache(cacheName: string, maxEntries: number): Promise<void> {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    if (keys.length <= maxEntries) {
      return;
    }
    
    // Sort by timestamp (oldest first)
    const entries: CacheEntry[] = [];
    
    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const cachedAt = response.headers.get('sw-cached-at');
        entries.push({
          url: request.url,
          timestamp: cachedAt ? parseInt(cachedAt) : 0,
          response: response,
        });
      }
    }
    
    entries.sort((a, b) => a.timestamp - b.timestamp);
    
    // Remove oldest entries
    const entriesToRemove = entries.slice(0, entries.length - maxEntries);
    for (const entry of entriesToRemove) {
      await cache.delete(new Request(entry.url));
    }
  }

  public async preloadCriticalAssets(): Promise<void> {
    const criticalAssets = [
      '/',
      '/manifest.json',
      '/_next/static/css/app/globals.css',
      '/icons/icon-192x192.png',
      '/icons/icon-512x512.png',
    ];

    const cache = await caches.open('stellaiverse-static');
    
    for (const asset of criticalAssets) {
      try {
        const response = await fetch(asset);
        if (response.ok) {
          await cache.put(asset, response);
        }
      } catch (error) {
        console.warn(`Failed to preload asset: ${asset}`, error);
      }
    }
  }

  public async updateCacheVersion(newVersion: string): Promise<void> {
    // Update all cache configurations with new version
    for (const config of this.cacheConfigs.values()) {
      config.version = newVersion;
    }

    // Clear old caches
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => 
      name.startsWith('stellaiverse-') && !name.includes(newVersion)
    );
    
    await Promise.all(oldCaches.map(name => caches.delete(name)));
  }
}

export default CacheManager;
