import { WebSocketServer, WebSocket } from 'ws'
import { CLIENTS_LIST, EVENTS } from './DB/db'
import { createClient } from 'redis';
import { config } from 'dotenv';

config()

const port = 8080;

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
console.log(REDIS_URL);

const wss = new WebSocketServer({ port });
const subscriber = createClient({ url: REDIS_URL });

const connectRedis = async () => {
  try {
    await subscriber.connect();
    console.log("connected to redis from ws")
  } catch (e) {
    console.error("error while connecting redis", e)
  }
};

connectRedis();

wss.on("connection", (ws: WebSocket) => {
  console.log("asdasd")
  ws.on("open", () => {
    console.log("OPEN")
  });

  ws.on("message", async (data: string) => {
    console.log(data.toString());
    const { type, orderbookId } = JSON.parse(data.toString())
    if (type && orderbookId) {

      if (type === "SUBSCRIBE") {

        const isSocketSubscribed = EVENTS.find(x => x == orderbookId)

        if (!isSocketSubscribed) {

          EVENTS.push(orderbookId)
          CLIENTS_LIST[orderbookId] = [ws];

          console.log(CLIENTS_LIST[orderbookId].length);

          subscriber.subscribe(orderbookId, (message) => {

            const orderbook = message.toString();

            CLIENTS_LIST[orderbookId].forEach((client: any) => {
              client.send(orderbook)
            });
          })
        } else {
          CLIENTS_LIST[orderbookId].push(ws)
        }

      } else if (type == "UNSUBSCRIBE") {
        CLIENTS_LIST[orderbookId] = CLIENTS_LIST[orderbookId].filter(
          (item) => item != ws
        );

        if (CLIENTS_LIST[orderbookId].length === 0) {
          await subscriber.unsubscribe(orderbookId);
          delete CLIENTS_LIST[orderbookId];
        }
        console.log(CLIENTS_LIST[orderbookId].length);
      }

    }
  });
});
