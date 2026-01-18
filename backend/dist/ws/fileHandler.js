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
                        this.filename = message.fileName;
                        this.fileId = getRandomString(10);
                        this.userId = message.userId;
                        console.log("create the file: ", this.fileId);
                        //logic to add the user ID and fileID to the manager class var
                        break;
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
                        //some error can occur here
                        let index = Manager.getInstance().files.findIndex(f => f.fileId == this.fileId);
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