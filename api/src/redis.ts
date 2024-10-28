import { createClient } from 'redis'


export const subscriber = createClient()
const client = createClient()


const connectRedis = async () => {
    try {
        await subscriber.connect();
        await client.connect()
        console.log("connected to redis")
    } catch(e) {
        console.error("failed to connect redis",e)
    }
}

export const queuePush = async (queueName:string, data:string) => {
    try{
        await client.lPush(queueName, data);
    } catch(e) {
        console.log("failed to push to queue",e)
    }
}

export default connectRedis;