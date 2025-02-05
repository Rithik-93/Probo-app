import { createClient } from 'redis'

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const subscriber = createClient({ url: REDIS_URL });
const client = createClient({ url: REDIS_URL });

const connectRedis = async () => {
    try {
        await subscriber.connect();
        await client.connect()
        console.log("connected to redis")
    } catch (e) {
        console.error("failed to connect redis", e)
    }
}

export const queuePush = async (queueName: string, data: string) => {
    try {
        await client.lPush(queueName, data);
    } catch (e) {
        console.log("failed to push to queue", e)
    }
}

export default connectRedis;