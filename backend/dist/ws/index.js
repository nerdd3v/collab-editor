import WebSocket, { WebSocketServer } from "ws";
import { server } from "../index.js";
export default async function initialiser() {
    const wss = new WebSocketServer({ server: server });
    wss.on('connection', (ws) => {
        ws.on('message', (data) => {
            console.log(data.toString());
        });
    });
}
//# sourceMappingURL=index.js.map