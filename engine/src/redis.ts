import { createClient } from "redis";
import { matchUrl } from "./router";
import { queueName } from ".";
import { ORDERBOOK } from "./DB/DB";

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

export const publishOrderbook = async (eventId: string) => {
  try {
    if (ORDERBOOK[eventId]) {
      // console.log("asd");

      const orderbook = getOrderBookByEvent(eventId);
      await publisher.publish(eventId, JSON.stringify(orderbook));
      // console.log("asdasdasd");
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
  // console.log('ORDERBOOK-----------------', symbolExists);


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