import {connection} from "websocket"
import { OutGoingMessage } from "./message/outgoingMessage";

interface User {
    name:string;
    id:string;
    conn: connection
}

interface Room {
    users: User[];
}

export class UserManager{
    private rooms: Map<string, Room>;

    constructor() {
        this.rooms = new Map<string, Room>();
    }

    addUser(name: string, userId: string, roomId: string, socket: connection){
        if(!this.rooms.get(roomId)){
            this.rooms.set(roomId,{
                users:[]
            })
        }
        
        this.rooms.get(roomId)?.users.push({
            id:userId,
            name,
            conn: socket,
        }) 
        console.log("user Added!!!");
        
    }

    removeUser(rooId: string, userId: string){
        const users = this.rooms.get(rooId)?.users;
        if(users){
            users.filter(({id})=> id!==userId)
        }
    }

    getUser(roomId: string, userId: string): User | null{
        const user = this.rooms.get(roomId)?.users.find((({id})=> id === userId))
        return user ?? null;
    }

    broadCast(roomId: string, userId: string, message: OutGoingMessage){
        console.log("under broadcast");
        
        const user = this.getUser(roomId,userId)
        if(!user){
            console.error("user not found");
            return;
        }

        const room = this.rooms.get(roomId);
        if(!room){
            console.error('room not found');
            return;
        }

        // const receivers = room.users.filter((user)=> user.id !== userId)
        room.users.forEach((({conn})=>{
            console.log("Outgoing message: " + JSON.stringify(message));
            conn.sendUTF(JSON.stringify(message));
        }))
    }
}


