import WebSocket, { WebSocketServer } from "ws";
import { server } from "../index.js";
import { File } from "./fileHandler.js";

export default async function initialiser(){
    const wss = new WebSocketServer({server: server});
    
    wss.on('connection', (ws: WebSocket)=>{
        const fileUser = new File(ws);

        ws.on('close', ()=>{
            console.log("session terminated")
            ws.close()
        })
    })
}