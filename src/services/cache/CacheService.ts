// src/services/cache/CacheService.ts
import { EventEmitter } from 'events';

interface CacheConfig {
  maxSize: number;
  ttl: number;
  cleanupInterval: number;
  strategy: 'LRU' | 'FIFO';
}

class CacheService {
  private cache: Map<string, CacheEntry<any>>;
  private config: CacheConfig;
  private eventEmitter: EventEmitter;
  private accessLog: string[];

  constructor(config: CacheConfig) {
    this.cache = new Map();
    this.config = config;
    this.eventEmitter = new EventEmitter();
    this.accessLog = [];
    this.startCleanupInterval();
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    if (this.cache.size >= this.config.maxSize) {
      await this.evict();
    }

    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      ttl: ttl || this.config.ttl,
      accessCount: 0
    };

    this.cache.set(key, entry);
    this.eventEmitter.emit('set', { key, timestamp: Date.now() });
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (this.isExpired(entry)) {
      await this.delete(key);
      return null;
    }

    entry.accessCount++;
    this.accessLog.push(key);
    this.eventEmitter.emit('get', { key, timestamp: Date.now() });
    return entry.value;
  }

  private async evict(): Promise<void> {
    if (this.config.strategy === 'LRU') {
      this.evictLRU();
    } else {
      this.evictFIFO();
    }
  }

  private async delete(key: string): Promise<void> {
    this.cache.delete(key);
    this.eventEmitter.emit('delete', { key, timestamp: Date.now() });
  }
}