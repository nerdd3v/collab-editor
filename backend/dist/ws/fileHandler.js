class File {
    filename;
    userId;
    ws;
    constructor(ws) {
        this.ws = ws;
        this.filename = null;
        this.userId = null;
        this.initHandler();
    }
    initHandler() {
        this.ws.on('message', (data) => {
            let message = JSON.parse(data.toString());
            switch (message.type) {
                case "interact":
                    this.filename = message.filename;
                    this.userId = message.userId;
            }
        });
    }
}
export {};
//# sourceMappingURL=fileHandler.js.map