
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

    public broadcast(i: Manager, id: string, data: string){
        const index = i.files.findIndex(ind => ind.fileId == id);

        if(index == -1){
            console.log("file Id does not exist");
            return;
        }
        else{
            //logic for broadcasting the messages to every user related to that file; except the sender sending it
            //exception logic later *****************************

            try{
                i.files[index]?.users.forEach(u=>{
                    u.send(data);
                })
                // might need to manipulate the data to send it in a better format
                console.log("sent/ broadcasted the data to the related file and users")
            }catch(e){
                console.error("some error occured in broadcasting the data")
            }
        }
    }
    


    public logger(id: string){
        const instance = Manager.getInstance();

        const index = instance.files.findIndex(f => f.fileId == id);

        if(index === -1){
            return 
        }

        const users = instance.files[index]?.users;

        for(let i = 0; i< users!.length; i++){
            console.log(users![i]);
        }
    }
}

//some error occured in the logger function