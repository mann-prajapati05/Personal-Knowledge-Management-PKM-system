import { createClient } from 'redis';

const redisHost = process.env.REDIS_HOST || 'redis';
const redisPort = Number(process.env.REDIS_PORT || 6379);

const redisClient = createClient({
  socket: {
    host: redisHost,
    port: redisPort,
  },
});

redisClient.on('error', () => {});

let connectPromise = null;

export const ensureRedisConnection = async () => {
  if (redisClient.isOpen) {
    return true;
  }

  if (!connectPromise) {
    connectPromise = redisClient
      .connect()
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        connectPromise = null;
      });
  }

  return connectPromise;
};

export const getCache = async (key) => {
  try {
    const connected = await ensureRedisConnection();
    if (!connected) {
      return null;
    }

    const cachedValue = await redisClient.get(key);
    if (cachedValue === null) {
      return null;
    }

    return JSON.parse(cachedValue);
  } catch {
    return null;
  }
};

export const setCache = async (key, value, ttl = 60) => {
  try {
    const connected = await ensureRedisConnection();
    if (!connected) {
      return false;
    }

    await redisClient.set(key, JSON.stringify(value), { EX: ttl });
    return true;
  } catch {
    return false;
  }
};

export const invalidateCache = async (key) => {
  try {
    const connected = await ensureRedisConnection();
    if (!connected) {
      return false;
    }

    await redisClient.del(key);
    return true;
  } catch {
    return false;
  }
};

export { redisClient };

export default redisClient;