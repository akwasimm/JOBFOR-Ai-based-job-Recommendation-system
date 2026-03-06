import Redis from 'ioredis';
import { env } from './env';

let redis: Redis | null = null;

export function getRedisClient(): Redis {
    if (!redis) {
        const isUpstash = env.REDIS_URL.startsWith('rediss://');

        redis = new Redis(env.REDIS_URL, {
            maxRetriesPerRequest: 3,
            // Upstash requires TLS — auto-enable when using rediss://
            tls: isUpstash ? { rejectUnauthorized: false } : undefined,
            retryStrategy(times) {
                if (times > 3) {
                    console.warn('⚠️ Redis connection failed after 3 retries. Running without cache.');
                    return null; // Stop retrying
                }
                return Math.min(times * 200, 2000);
            },
            lazyConnect: true,
        });

        redis.on('error', (err) => {
            console.warn('⚠️ Redis error:', err.message);
        });

        redis.on('connect', () => {
            console.log('✅ Redis connected (Upstash)');
        });
    }

    return redis;
}


/**
 * Gracefully disconnect Redis
 */
export async function disconnectRedis(): Promise<void> {
    if (redis) {
        await redis.quit();
        redis = null;
    }
}
