import type WebSocket from "ws";

interface fileUsers{
    fileId: string, //give this as an id to the file
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
        const fileIndex = instance.files.findIndex(i => i.fileId === f);
        
        if (fileIndex !== -1) {
            if (!instance.files[fileIndex]?.users.includes(uid)) {  
                instance.files[fileIndex]?.users.push(uid);
            }
        } else {
            instance.files.push({ fileId: f, users: [uid] });
        }
    }

    public removeUser(id: string,uid:WebSocket){ //here id = fileId

        const instance = Manager.getInstance()
        const index = instance.files.findIndex(i => i.fileId == id)

        if(index == -1){
            return;
        }
        else{
            console.log("entry to the remove user")
            //@ts-ignore
            instance.files[index]!.users = instance.files[index]?.users.filter(u => u == uid)
            console.log("user removed from the array")
        }
        

        if(instance.files[index]?.users.length == 0){
            instance.files.splice(index, 1);
            console.log("removed the file exixtsnce since the user length was 0")
        }
    }

    public broadcast(i: Manager, id: string){
        const index = i.files.findIndex(ind => ind.fileId == id);

        if(index == -1){
            console.log("")
        }
    }
    


    public logger(){
        console.log(Manager.getInstance().files)
    }
}