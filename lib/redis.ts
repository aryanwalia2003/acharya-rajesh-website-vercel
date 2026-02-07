import Redis from 'ioredis';

const redisClient = () => {
  if (process.env.REDIS_URL) {
    return new Redis(process.env.REDIS_URL);
  }
  throw new Error('REDIS_URL is not defined in .env');
};

const redis = redisClient();

redis.on('connect', () => {
  console.log('[REDIS] Connection established successfully');
});

redis.on('error', (err) => {
  console.error('[REDIS] Connection error:', err);
});

export { redis };