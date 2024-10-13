type UserId = string;

export interface Chat {
    userId:UserId;
    name: string;
    message: string;
    upvotes: UserId[] ;
    id:string;
}

export abstract class Store {
    constructor(){

    }

    initRoom(roomId:string){

    }

    getChats(roomId: string, limit: number, offset: number){

    }

    addChats(userId:string, name: string, roomId: string, message:string){

    }

    upvote(userId:string,roomId: string, chatId: string){

    }
}