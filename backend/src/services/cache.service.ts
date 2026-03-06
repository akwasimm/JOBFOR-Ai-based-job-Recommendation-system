import { getRedisClient } from '@/config/redis';

/**
 * Enterprise service governing high-performance, key-value temporary persistence operations
 * targeting the Redis memory layer, significantly accelerating redundant read transactions.
 * 
 * @class CacheService
 */
export class CacheService {
    /**
     * Instantiates asynchronous network calls fetching mapped binary objects deserializing them
     * into requested generalized type strictures.
     * 
     * @template T Output resolution generic enforcing type synchronization.
     * @param {string} key - Unique alphanumeric identifier mapping targeting memory addresses.
     * @returns {Promise<T | null>} Interpreted schema structures matching foundational queries or null if missing.
     */
    async get<T>(key: string): Promise<T | null> {
        try {
            const client = getRedisClient();
            const value = await client.get(key);
            return value ? JSON.parse(value) : null;
        } catch {
            return null;
        }
    }

    /**
     * Transforms complex entity types assigning localized Redis strings dictating definitive Time-to-Live
     * configuration limits optimizing rapid subsequent recall mechanics.
     * 
     * @param {string} key - Structural index label isolating memory clusters.
     * @param {any} value - Generic topological tree resolving target mapping payload.
     * @param {number} [ttl=600] - Lifespan parameter measured strictly in synchronized seconds.
     * @returns {Promise<void>} Yields execution completion resolving asynchronous data placement.
     */
    async set(key: string, value: any, ttl: number = 600): Promise<void> {
        try {
            const client = getRedisClient();
            await client.set(key, JSON.stringify(value), 'EX', ttl);
        } catch {
        }
    }

    /**
     * Executes targeted garbage collection terminating isolated linkage strings directly from memory mapping levels.
     * 
     * @param {string} key - Maps exact targeting string for deterministic unlinking routines.
     * @returns {Promise<void>} Assures validation denoting synchronous finality without exceptions.
     */
    async del(key: string): Promise<void> {
        try {
            const client = getRedisClient();
            await client.del(key);
        } catch {
        }
    }

    /**
     * Iterates heuristic regular expressions parsing complete database architectures nullifying clusters based
     * on variable string parameters enabling scalable invalidation events.
     * 
     * @param {string} pattern - Variable regular expression encapsulating desired matching indices.
     * @returns {Promise<void>} Resolves silent teardown operation logic averting operational blockers upon error.
     */
    async delPattern(pattern: string): Promise<void> {
        try {
            const client = getRedisClient();
            const keys = await client.keys(pattern);
            if (keys.length > 0) {
                await client.del(...keys);
            }
        } catch {
        }
    }

    /**
     * Executes conditional logical intersections dynamically determining whether to return fast memory segments
     * or execute heavy computational functions, immediately caching resulting output properties subsequently.
     * 
     * @template T Defines predictable computational boundaries tracking functional return behaviors.
     * @param {string} key - Designated alphanumeric label constraining the execution paths.
     * @param {() => Promise<T>} fetcher - Dependent promise wrapper resolving unoptimized calculation sequences.
     * @param {number} [ttl=600] - Denotes expiration matrix boundaries dictating longevity variables.
     * @returns {Promise<T>} Rapid delivery structure matching optimized or freshly calculated metadata profiles.
     */
    async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttl: number = 600): Promise<T> {
        const cached = await this.get<T>(key);
        if (cached) return cached;

        const value = await fetcher();
        await this.set(key, value, ttl);
        return value;
    }
}

export const cacheService = new CacheService();
