/**
 * Media Cache Utility
 * Implements caching mechanisms for media content to improve performance
 */

interface CacheEntry {
  data: string | Blob;
  timestamp: number;
  size: number;
  type: "url" | "blob" | "thumbnail";
  accessCount: number;
  lastAccessed: number;
}

interface CacheStats {
  totalSize: number;
  entryCount: number;
  hitRate: number;
  totalHits: number;
  totalMisses: number;
}

class MediaCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize: number;
  private maxAge: number;
  private stats = {
    totalHits: 0,
    totalMisses: 0,
  };

  constructor(maxSize = 50 * 1024 * 1024, maxAge = 30 * 60 * 1000) {
    // 50MB, 30 minutes
    this.maxSize = maxSize;
    this.maxAge = maxAge;

    // Clean up expired entries periodically
    setInterval(() => this.cleanup(), 5 * 60 * 1000); // Every 5 minutes
  }

  /**
   * Get cached media data
   */
  get(key: string): string | Blob | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.totalMisses++;
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      this.stats.totalMisses++;
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.stats.totalHits++;

    return entry.data;
  }

  /**
   * Set cached media data
   */
  set(
    key: string,
    data: string | Blob,
    type: CacheEntry["type"] = "url"
  ): boolean {
    const size = typeof data === "string" ? data.length * 2 : data.size; // Rough size estimation

    // Don't cache if item is too large
    if (size > this.maxSize * 0.1) {
      // Don't cache items larger than 10% of total cache
      return false;
    }

    // Make room if necessary
    this.ensureSpace(size);

    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      size,
      type,
      accessCount: 1,
      lastAccessed: Date.now(),
    };

    this.cache.set(key, entry);
    return true;
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Check if expired
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Remove entry from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const totalSize = Array.from(this.cache.values()).reduce(
      (sum, entry) => sum + entry.size,
      0
    );

    const hitRate =
      this.stats.totalHits + this.stats.totalMisses > 0
        ? this.stats.totalHits / (this.stats.totalHits + this.stats.totalMisses)
        : 0;

    return {
      totalSize,
      entryCount: this.cache.size,
      hitRate,
      totalHits: this.stats.totalHits,
      totalMisses: this.stats.totalMisses,
    };
  }

  /**
   * Ensure there's enough space for new entry
   */
  private ensureSpace(requiredSize: number): void {
    const currentSize = this.getCurrentSize();

    if (currentSize + requiredSize <= this.maxSize) {
      return;
    }

    // Remove entries using LRU strategy
    const entries = Array.from(this.cache.entries()).sort(
      ([, a], [, b]) => a.lastAccessed - b.lastAccessed
    );

    let freedSize = 0;
    for (const [key, entry] of entries) {
      this.cache.delete(key);
      freedSize += entry.size;

      if (currentSize - freedSize + requiredSize <= this.maxSize) {
        break;
      }
    }
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.maxAge) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach((key) => this.cache.delete(key));
  }

  /**
   * Get current cache size
   */
  private getCurrentSize(): number {
    return Array.from(this.cache.values()).reduce(
      (sum, entry) => sum + entry.size,
      0
    );
  }
}

// Singleton instance
export const mediaCache = new MediaCache();

/**
 * Cached fetch function for media URLs
 */
export async function cachedFetch(
  url: string,
  type: CacheEntry["type"] = "url"
): Promise<string> {
  // Check cache first
  const cached = mediaCache.get(url);
  if (cached && typeof cached === "string") {
    return cached;
  }

  try {
    // Fetch from network
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.text();

    // Cache the result
    mediaCache.set(url, data, type);

    return data;
  } catch (error) {
    console.warn("Failed to fetch media:", url, error);
    throw error;
  }
}

/**
 * Cached blob fetch for binary media content
 */
export async function cachedBlobFetch(
  url: string,
  type: CacheEntry["type"] = "blob"
): Promise<Blob> {
  // Check cache first
  const cached = mediaCache.get(url);
  if (cached && cached instanceof Blob) {
    return cached;
  }

  try {
    // Fetch from network
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const blob = await response.blob();

    // Cache the result
    mediaCache.set(url, blob, type);

    return blob;
  } catch (error) {
    console.warn("Failed to fetch media blob:", url, error);
    throw error;
  }
}

/**
 * Generate cache key for media with parameters
 */
export function generateCacheKey(
  url: string,
  params?: Record<string, any>
): string {
  if (!params) return url;

  const paramString = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `${url}?${paramString}`;
}

/**
 * Preload media into cache
 */
export async function preloadMedia(
  urls: string[],
  type: CacheEntry["type"] = "url"
): Promise<void> {
  const promises = urls.map(async (url) => {
    if (!mediaCache.has(url)) {
      try {
        await cachedFetch(url, type);
      } catch (error) {
        console.warn("Failed to preload media:", url, error);
      }
    }
  });

  await Promise.allSettled(promises);
}
