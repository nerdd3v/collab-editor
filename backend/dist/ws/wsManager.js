export class Manager {
    files;
    static instance;
    constructor() {
        this.files = [];
    }
    static getInstance() {
        if (!Manager.instance) {
            Manager.instance = new Manager();
        }
        return Manager.instance;
    }
    addUser(f, uid) {
        const instance = Manager.getInstance(); // ✅ Single call
        const fileIndex = instance.files.findIndex(i => i.filename === f);
        if (fileIndex !== -1) {
            if (!instance.files[fileIndex]?.users.includes(uid)) {
                instance.files[fileIndex]?.users.push(uid);
            }
        }
        else {
            instance.files.push({ filename: f, users: [uid] });
        }
    }
    logger() {
        console.log(Manager.getInstance().files);
    }
}
//# sourceMappingURL=wsManager.js.map