class Mangaer{
    private file: Array<Object>; //{"filename": ["uid1", uid2]}
    static instance: Mangaer;

    private constructor(){
        this.file = [];
    }

    static getInstance(){
        if(!Mangaer.instance){
            Mangaer.instance = new Mangaer()
        }
        return Mangaer.instance
    }

    public addUser(file: String){
        
    }
}