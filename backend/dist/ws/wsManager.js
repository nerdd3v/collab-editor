class Mangaer {
    file; //{"filename": ["uid1", uid2]}
    static instance;
    constructor() {
        this.file = [];
    }
    static getInstance() {
        if (!Mangaer.instance) {
            Mangaer.instance = new Mangaer();
        }
        return Mangaer.instance;
    }
    addUser(file) {
    }
}
export {};
//# sourceMappingURL=wsManager.js.map