import type WebSocket from "ws";

class File{
    public filename: String | null;
    public userId:String | null;
    private ws: WebSocket

    constructor(ws: WebSocket){
        this.ws = ws;
        this.filename = null
        this.userId = null;
        this.initHandler()
    }

    initHandler(){
        this.ws.on('message',(data)=>{
            let message = JSON.parse(data.toString());

            switch(message.type){
                case "interact":
                    this.filename = message.filename
                    this.userId = message.userId
            }
        })
    }

}