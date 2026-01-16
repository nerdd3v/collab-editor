import WebSocket, { WebSocketServer } from "ws";
import { server } from "../index.js";




const wss = new WebSocketServer({server: server});

wss.on('connection', (ws: WebSocket)=>{
    ws.on('message', (data)=>{
        console.log(data.toString())
    })
})