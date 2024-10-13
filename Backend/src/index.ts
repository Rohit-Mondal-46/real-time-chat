import {server as WebSocketServer, connection} from 'websocket';
import http from 'http';
import {IncomingSupportedMessage,ImcomingMessage as Imsg} from './message/incomingMessage'
import {OutgoingSupportedMessage,OutGoingMessage as Omsg} from './message/outgoingMessage'
import { UserManager } from './userManager';
import { ImMemoryStore } from './store/InMemoryStore';


const userManager = new UserManager();
const store = new ImMemoryStore();


const server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});


server.listen(8000, function() {
    console.log((new Date()) + ' Server is listening on port 8000');
});

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin: string) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request:any) {
    console.log("inside request");
    
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    } 
    
    var connection = request.accept("echo-protocol", request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message:any) {
        if (message.type === 'utf8') {
            try {
                messageHandler(connection,JSON.parse(message.utf8Data))
            } catch (error) {
                console.error(error)
            }
        }
        
    });
    connection.on('close', function(reasonCode:any, description:any) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

function messageHandler(ws: connection,message: Imsg){
    if(message.type === IncomingSupportedMessage.JoinRoom){
        const payload = message.payload;
        userManager.addUser(payload.name,payload.userId,payload.roomId,ws);
    }
    
    if(message.type === IncomingSupportedMessage.SendMessage){
        const payload = message.payload;
        const user = userManager.getUser(payload.roomId,payload.userId);

        if(!user){
            console.error('user not found')
            return;
        }

        let chat = store.addChats(payload.userId,user.name,payload.roomId,payload.message);
        if(!chat){
            return;
        }

        const outGoingPayload: Omsg = {
            type: OutgoingSupportedMessage.AddChat,
            payload: {
                chatId: chat.id,
                roomId: payload.roomId,
                message: payload.message,
                name: user.name,
                upvote: 0 
            }
        }
        
        userManager.broadCast(payload.roomId,payload.userId,outGoingPayload);
    }

    if(message.type === IncomingSupportedMessage.UpvoteMessage){
        const payload = message.payload;

        let chat = store.upvote(payload.userId,payload.roomId,payload.chatId);

        if(!chat){
            return;
        }
        const outGoingPayload: Omsg = {
            type: OutgoingSupportedMessage.UpdateChat,
            payload: {
                chatId: chat.id,
                roomId: payload.roomId,
                upvote: chat.upvotes.length
            }
        }

        userManager.broadCast(payload.roomId,payload.userId,outGoingPayload);
    }
}





