import { registerAs } from '@nestjs/config';

export default registerAs('queue', () => ({
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USERNAME,
    db: parseInt(process.env.REDIS_DB || '0', 10),
  },
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    delay: 0,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
  concurrency: parseInt(process.env.QUEUE_CONCURRENCY || '5', 10),
}));
