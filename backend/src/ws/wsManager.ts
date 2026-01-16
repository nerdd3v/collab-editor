import type WebSocket from "ws";

interface fileUsers{
    filename: string,
    users: WebSocket[]
}

export class Manager{
    public files: fileUsers[];
    static instance: Manager;

    private constructor(){
        this.files = [];
    }

    static getInstance(){
        if(!Manager.instance){
            Manager.instance = new Manager()
        }
        return Manager.instance
    }

    public addUser(f: string, uid: WebSocket) {
        const instance = Manager.getInstance();  // ✅ Single call
        const fileIndex = instance.files.findIndex(i => i.filename === f);
        
        if (fileIndex !== -1) {
            if (!instance.files[fileIndex]?.users.includes(uid)) {  
                instance.files[fileIndex]?.users.push(uid);
            }
        } else {
            instance.files.push({ filename: f, users: [uid] });
        }
    }

    public broadcast(){

    }
    


    public logger(){
        console.log(Manager.getInstance().files)
    }
}