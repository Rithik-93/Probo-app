import { createClient } from "redis";

export const publisher = createClient()
const consumer = createClient()

const queueName: string = "apiToEngine"

interface QueueDataType {
    _id: string;
    endpoint: string;
    req: QUEUE_REQUEST;
}

interface QUEUE_REQUEST {
    body: {
        userId?: string;
        amount?: string;
        stockSymbol?: string;
        quantity?: number;
        price?: number;
        stockType?: "yes" | "no"
    }
    params: {
        userId?: string;
        stockSymbol?: string
    }
}

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


const matchUrl = async (data: QueueDataType) => {
    let response;
    try {
        switch (data.endpoint) {
            case "/asd":
                console.log("Processing endpoint /asd");
                response = await respond(data.req);
            break;
        }
        console.log("Publishing response:", response);
        await publisher.publish(data._id, JSON.stringify(response));
    } catch (e) {
        console.error("Error in matchUrl:", e);
    }
}

const respond = async (req: QUEUE_REQUEST) => {
    return { statusCode: 401, data: "pararar" }
}