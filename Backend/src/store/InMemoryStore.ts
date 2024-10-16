import { Chat, Store } from "./store";
let globalChatId = 0;
export interface Room {
    roomId:string;
    chats: Chat[] ;
}

export class ImMemoryStore implements Store {
    private store: Map<string,Room>;
    constructor(){
        this.store = new Map<string,Room>();
    }

    initRoom(roomId:string){
        this.store.set(roomId,{
            roomId,
            chats:[]
        });
    }

    getChats(roomId: string, limit: number, offset: number){
        const room = this.store.get(roomId);
        if(!room){
            return [];
        }
        //TODO: Add the logic of limit & offset
        return room.chats;
    }

    addChats(userId:string, name: string, roomId: string, message:string){
        
        let room = this.store.get(roomId);
        if(!room){
            this.initRoom(roomId);
            room = this.store.get(roomId);
        }
        const chat = {
            userId,
            name,
            message,
            upvotes:[],
            id: (globalChatId++).toString()
        }
        if(room){
            room.chats.push(chat)
            console.log("chat added to array: ", chat);
            console.log(`all chats: (${room.chats.length})`, room.chats);
            return chat;
        }
        return null
    }

    upvote(userId:string,roomId: string, chatId: string){
        const room = this.store.get(roomId);
        if(!room){
            return;
        }
        const chat = room.chats.find(({id}) => id == chatId);
        if(chat){
            if(chat.upvotes.find((x => x === userId))){
                return chat;
            }
            chat.upvotes.push(userId);
            console.log("added to upvote");
            
        }
        return chat;
    }
}