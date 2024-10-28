import { createClient } from "redis";
import { matchUrl } from "./router";
import { queueName } from ".";

export const publisher = createClient()
const consumer = createClient()

export const redisConnect = async () => {
    try {
        await consumer.connect()
        await publisher.connect()
        listenQueues(queueName)
    } catch (e) {
        console.log("err", e)
    }
}

export const listenQueues = async (queueNames: string) => {
    while (true) {
        const payload = await consumer.brPop(queueNames, 0)
        if (payload) {
            const data = JSON.parse(payload.element)
            matchUrl(data)
        }
    }
}

// const respond = async (req: QUEUE_REQUEST) => {
//     return { statusCode: 401, data: "pararar" }
// }