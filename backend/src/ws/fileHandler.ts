import type WebSocket from "ws";
import { Manager } from "./wsManager.js";



class File{
    public filename: string | null;
    public userId: string | null;
    private ws: WebSocket

    constructor(ws: WebSocket){
        this.ws = ws;
        this.filename = null
        this.userId = null;
        this.initHandler()
    }

    initHandler() {
        this.ws.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());
                
                switch (message.type) {
                    case "interact":
                        this.filename = message.filename;
                        this.userId = message.userId;
                        
                        if (this.filename && this.userId) {  // ✅ Null check
                            Manager.getInstance().addUser(this.filename, this.userId);
                            console.log("user added:", Manager.getInstance().logger());
                        }

                        
                        break;
                }
            } catch (error) {
                console.error("Invalid message:", error);
            }
        });
    }
    

}