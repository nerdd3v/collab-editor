import type WebSocket from "ws";
interface fileUsers {
    fileId: string;
    users: WebSocket[];
}
export declare class Manager {
    files: fileUsers[];
    static instance: Manager;
    private constructor();
    static getInstance(): Manager;
    addUser(f: string, uid: WebSocket): void;
    removeUser(id: string, uid: WebSocket): void;
    broadcast(i: Manager, id: string): void;
    logger(): void;
}
export {};
//# sourceMappingURL=wsManager.d.ts.map