import { Manager } from "./wsManager.js";
import { fileModel } from "../db/index.js";
import { getRandomString } from "../services/randomIdGenerator.js";
// from next time I can create a keyPair of the curve in order to give this a random fileId
// do the seed and bumps
export class File {
    filename;
    userId;
    ws;
    content;
    fileId;
    constructor(ws) {
        this.ws = ws;
        this.filename = null;
        this.userId = null;
        this.content = null;
        this.fileId = null;
        this.initHandler();
    }
    initHandler() {
        this.ws.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());
                switch (message.type) {
                    case "create":
                        let instance = Manager.getInstance();
                        this.filename = message.fileName;
                        this.fileId = getRandomString(10);
                        this.userId = message.userId;
                        console.log("create the file: ", this.fileId);
                        instance.addUser(this.fileId, this.ws);
                        console.log("user created the file with fileId: ", this.fileId);
                        instance.broadcast(instance, this.fileId, "boss cretaed the hood");
                        console.log("user added:", instance.logger(this.fileId));
                        break;
                    case "interact":
                        this.filename = message.filename;
                        this.userId = message.userId;
                        this.fileId = message.fileId;
                        if (this.fileId && this.userId) { // ✅ Null check
                            Manager.getInstance().addUser(this.fileId, this.ws);
                            console.log("user added:", Manager.getInstance().logger(this.fileId));
                        }
                        Manager.getInstance().broadcast(Manager.getInstance(), this.fileId, "thug added to the hood");
                        break;
                    case "contribute":
                        console.log("entry1");
                        this.content = message.content;
                        this.fileId = message.fileId;
                        console.log("entry2");
                        if (!this.content) {
                            return;
                        }
                        console.log("entry3");
                        let index = Manager.getInstance().files.findIndex(f => f.fileId == this.fileId);
                        console.log("entry4");
                        Manager.getInstance().files[index]?.users.forEach(ws => {
                            ws.send(this.content);
                        });
                        console.log("entry5");
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