import { ensureRedisConnection, redisClient } from '../config/redis.js';

const AUTH_RATE_LIMIT = 5;
const AUTH_RATE_LIMIT_WINDOW_SECONDS = 30;

const getClientIp = (req) => req.ip || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';

export const authRateLimit = async (req, res, next) => {
  try {
    const connected = await ensureRedisConnection();
    if (!connected) {
      return next();
    }

    const key = `auth:rate:${getClientIp(req)}`;
    const requests = await redisClient.incr(key);

    if (requests === 1) {
      await redisClient.expire(key, AUTH_RATE_LIMIT_WINDOW_SECONDS);
    }

    if (requests >= AUTH_RATE_LIMIT) {
      const ttl = await redisClient.ttl(key);
      const retryAfter = ttl > 0 ? ttl : AUTH_RATE_LIMIT_WINDOW_SECONDS;

      return res.status(429).json({
        error: 'Too many auth requests. Please try again later.',
        retryAfter,
      });
    }

    return next();
  } catch {
    return next();
  }
};