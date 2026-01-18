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
        const fileIndex = instance.files.findIndex(i => i.fileId === f);
        if (fileIndex !== -1) {
            if (!instance.files[fileIndex]?.users.includes(uid)) {
                instance.files[fileIndex]?.users.push(uid);
            }
        }
        else {
            instance.files.push({ fileId: f, users: [uid] });
        }
    }
    removeUser(id, uid) {
        const instance = Manager.getInstance();
        const index = instance.files.findIndex(i => i.fileId == id);
        if (index == -1) {
            return;
        }
        else {
            console.log("entry to the remove user");
            //@ts-ignore
            instance.files[index].users = instance.files[index]?.users.filter(u => u == uid);
            console.log("user removed from the array");
        }
        if (instance.files[index]?.users.length == 0) {
            instance.files.splice(index, 1);
            console.log("removed the file exixtsnce since the user length was 0");
        }
    }
    broadcast(i, id, data) {
        const index = i.files.findIndex(ind => ind.fileId == id);
        if (index == -1) {
            console.log("file Id does not exist");
            return;
        }
        else {
            //logic for broadcasting the messages to every user related to that file; except the sender sending it
            //exception logic later *****************************
            try {
                i.files[index]?.users.forEach(u => {
                    u.send(data);
                });
                // might need to manipulate the data to send it in a better format
                console.log("sent/ broadcasted the data to the related file and users");
            }
            catch (e) {
                console.error("some error occured in broadcasting the data");
            }
        }
    }
    logger(id) {
        const instance = Manager.getInstance();
        const index = instance.files.findIndex(f => f.fileId == id);
        if (index === -1) {
            return;
        }
        const users = instance.files[index]?.users;
        for (let i = 0; i < users.length; i++) {
            console.log(users[i]);
        }
    }
}
//some error occured in the logger function
//# sourceMappingURL=wsManager.js.map