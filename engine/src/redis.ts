import { createClient } from "redis";
import { matchUrl } from "./router";
import { queueName } from ".";
import { ORDERBOOK } from "./DB/DB";
import { config } from 'dotenv'

config();
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
console.log(REDIS_URL);


export const publisher = createClient({url: REDIS_URL})
const consumer = createClient({url: REDIS_URL})

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

export const publishOrderbook = async (eventId: string) => {
  try {
    if (ORDERBOOK[eventId]) {

      const orderbook = getOrderBookByEvent(eventId);
      console.log(orderbook);
      await publisher.publish(eventId, JSON.stringify(orderbook));
    }
    return;
  } catch (err) {
    console.log(err);
    return;
  }
};

const getOrderBookByEvent = (eventId: string) => {
  let orderbook;
  const symbolExists = ORDERBOOK[eventId];


  if (symbolExists) {
    orderbook = Object.fromEntries(
      Object.entries(symbolExists).map(([type, ordersMap]) => {
        const orders = Array.from(ordersMap).map(([price, orders]) => {
          return { price, quantity: orders.total };
        });
        return [[type], orders];
      })
    );
  } else {
    orderbook = { eventId: {} };
  }

  return orderbook;
};