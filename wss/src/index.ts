import { WebSocketServer, WebSocket } from 'ws'
import { CLIENTS_LIST, EVENTS } from './Globals/global';
import { createClient } from 'redis';

const port = 3000;

const wss = new WebSocketServer({ port });
const subscriber = createClient();

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
  })

  ws.on("message", async (data: string) => {
    console.log(data.toString());
    const { type, orderbookId } = JSON.parse(data.toString())
    if (type && orderbookId) {
      if (type === "SUBSCRIBE") {

        const isSocketSubscribed = EVENTS.find(x => x == orderbookId)

        if (!isSocketSubscribed) {

          EVENTS.push(orderbookId)
          CLIENTS_LIST[orderbookId] = [ws];

          subscriber.subscribe(orderbookId, (message) => {

            const orderbook = message.toString();
            
            CLIENTS_LIST[orderbookId].forEach((client: any) => {
              client.send(orderbook)
            });
          })
        } else {
          CLIENTS_LIST[orderbookId].push(ws)
        }

      } else if (type === "UNSUBSCRIBE") {
        if (CLIENTS_LIST[orderbookId].has(ws)) {
          CLIENTS_LIST[orderbookId].delete(ws)
        }
        if (CLIENTS_LIST[orderbookId].size === 0) {
          await subscriber.unsubscribe(orderbookId)
          delete CLIENTS_LIST[orderbookId];
        }
      }
    }
  })
})