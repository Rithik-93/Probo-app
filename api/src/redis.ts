import { createClient } from 'redis';
import { config } from 'dotenv';

config(); // Load environment variables

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Parse Redis URL for hostname, port, username, and password
const redisUrl = new URL(REDIS_URL);
const isUpstash = redisUrl.protocol === 'rediss:';

const redisOptions = {
  url: REDIS_URL,
  socket: {
    tls: isUpstash,
  },
  username: redisUrl.username || undefined,
  password: redisUrl.password || undefined,
};

export const subscriber = createClient(redisOptions);
export const client = createClient(redisOptions);

const connectRedis = async () => {
  try {
    await subscriber.connect();
    await client.connect();
    console.log("✅ Connected to Redis");
  } catch (e) {
    console.error("❌ Failed to connect to Redis:", e);
  }
};

// Queue push function
export const queuePush = async (queueName: string, data: string) => {
  try {
    await client.lPush(queueName, data);
  } catch (e) {
    console.error("❌ Failed to push to queue:", e);
  }
};

export default connectRedis;
