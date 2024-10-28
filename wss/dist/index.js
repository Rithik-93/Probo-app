"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const port = 3000;
const wss = new ws_1.WebSocketServer({ port });
wss.on("connection", (ws) => {
    console.log("asdasd");
    ws.on("open", () => {
        console.log("OPRN");
    });
    ws.on("message", (data) => {
        console.log(data.toString());
    });
});
