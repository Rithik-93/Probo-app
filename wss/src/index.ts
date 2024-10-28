import { WebSocketServer, WebSocket } from 'ws'

const port = 3000;

const wss = new WebSocketServer({ port });

wss.on("connection", (ws:WebSocket) => {
  console.log("asdasd")
  ws.on("open", () => {
    console.log("OPRN")
  })

  ws.on("message", (data:string) => {
    console.log(data.toString());
  })
})