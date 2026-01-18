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
        const instance = Manager.getInstance();
        this.ws.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());
                switch (message.type) {
                    case "create":
                        this.filename = message.fileName;
                        this.fileId = getRandomString(10);
                        this.userId = message.userId;
                        console.log("create the file: ", this.fileId);
                        //logic to add the user ID and fileID to the manager class var
                        instance.addUser(this.fileId, this.ws);
                        console.log("user created the file with fileId: ", this.fileId);
                        instance.broadcast(instance, this.fileId, "boss cretaed the hood");
                        break;
                    case "interact":
                        this.filename = message.filename;
                        this.userId = message.userId;
                        this.fileId = message.fileId;
                        if (this.fileId && this.userId) { // ✅ Null check
                            instance.addUser(this.fileId, this.ws);
                            console.log("user added:", instance.logger(this.fileId));
                        }
                        instance.broadcast(instance, this.fileId, "thug added to the hood");
                        break;
                    case "contribute":
                        this.content = message.content;
                        if (!this.content) {
                            return;
                        }
                        //some error can occur here
                        let index = instance.files.findIndex(f => f.fileId == this.fileId);
                        instance.files[index]?.users.forEach(ws => {
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