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
        console.log('Received message:', message);
        if (message.type === 'utf8') {
            try {
                const parsedData = JSON.parse(message.utf8Data)
                console.log("Received message parsed: ", parsedData);
                if (parsedData.type === 'PING') {
                    connection.sendUTF(JSON.stringify({ type: 'PONG' }));
                  }
                messageHandler(connection,parsedData)
            } catch (error) {
                console.error(error)
            }
        }
    });
    connection.on('close', function(reasonCode:any, description:any) {
        console.log(' Peer ' + connection.remoteAddress + ' disconnected. ' + "reason: " + reasonCode + " des: " + description);
    });
});

function messageHandler(ws: connection,message: Imsg){
    try {
        if(message.type === IncomingSupportedMessage.JoinRoom){
            // console.log("under join room fn: ");
            const payload = message.payload;
            userManager.addUser(payload.name,payload.userId,payload.roomId,ws);
        }
        
        else if(message.type === IncomingSupportedMessage.SendMessage){
            // console.log('under send-messsage fn:', message, '\n');
            const payload = message.payload;
            const user = userManager.getUser(payload.roomId,payload.userId);
    
            if(!user){
                // console.error('user not found')
                return;
            }
            //TODO: chat is added but all chat is not rendering.......
            let chat = store.addChats(payload.userId,user.name,payload.roomId,payload.message);
            // console.log(chat);
            if(!chat){
                // console.log("chat not found");
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
    
        else if(message.type === IncomingSupportedMessage.UpvoteMessage){
            console.log('Received message at upvote:', message);
    
            const payload = message.payload;
    
            let chat = store.upvote(payload.userId,payload.roomId,payload.chatId);
            console.log("upvotes: ", chat?.upvotes);
            
            if(!chat){
                console.log("chat not found at upvote");
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
    } catch (error) {
        console.log(error);
        
    }
}





