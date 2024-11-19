import Redis from 'ioredis';

const redis = new Redis({
  host: 'ia4birds-platform.air-institute.com',
  port: 6379,
  // username: 'kommandant',
  password: '¿-K4pel1a_su0M1'
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err: Error) => {
  console.error('Redis error', err);
});

export default redis;