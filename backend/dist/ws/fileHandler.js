import { Manager } from "./wsManager.js";
import { fileModel } from "../db/index.js";
class File {
    filename;
    userId;
    ws;
    content;
    constructor(ws) {
        this.ws = ws;
        this.filename = null;
        this.userId = null;
        this.content = null;
        this.initHandler();
    }
    initHandler() {
        this.ws.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());
                switch (message.type) {
                    case "interact":
                        this.filename = message.filename;
                        this.userId = message.userId;
                        if (this.filename && this.userId) { // ✅ Null check
                            Manager.getInstance().addUser(this.filename, this.ws);
                            console.log("user added:", Manager.getInstance().logger());
                        }
                        break;
                    case "contribute":
                        this.content = message.content;
                        if (!this.content) {
                            return;
                        }
                        let index = Manager.getInstance().files.findIndex(f => f.filename == this.filename);
                        Manager.getInstance().files[index]?.users.forEach(ws => {
                            ws.send(this.content);
                        });
                        break;
                }
            }
            catch (error) {
                console.error("Invalid message:", error);
            }
        });
    }
}
//# sourceMappingURL=fileHandler.js.map