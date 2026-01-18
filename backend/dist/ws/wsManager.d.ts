import type WebSocket from "ws";
interface fileUsers {
    filename: string;
    users: WebSocket[];
}
export declare class Manager {
    files: fileUsers[];
    static instance: Manager;
    private constructor();
    static getInstance(): Manager;
    addUser(f: string, uid: WebSocket): void;
    broadcast(): void;
    logger(): void;
}
export {};
//# sourceMappingURL=wsManager.d.ts.map