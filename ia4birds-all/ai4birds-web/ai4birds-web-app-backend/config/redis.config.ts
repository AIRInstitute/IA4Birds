import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config({ path: "/home/node/app/ai4birds-web-app-backend/.env" });

const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err: Error) => {
  console.error('Redis error', err);
});

export default redis;