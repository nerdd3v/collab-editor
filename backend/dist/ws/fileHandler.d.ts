import type WebSocket from "ws";
export declare class File {
    filename: string | null;
    userId: string | null;
    private ws;
    content: string | null;
    fileId: string | null;
    constructor(ws: WebSocket);
    initHandler(): void;
}
//# sourceMappingURL=fileHandler.d.ts.map