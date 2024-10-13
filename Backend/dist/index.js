"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const websocket_1 = require("websocket");
const http_1 = __importDefault(require("http"));
const incomingMessage_1 = require("./message/incomingMessage");
const outgoingMessage_1 = require("./message/outgoingMessage");
const userManager_1 = require("./userManager");
const InMemoryStore_1 = require("./store/InMemoryStore");
const userManager = new userManager_1.UserManager();
const store = new InMemoryStore_1.ImMemoryStore();
const server = http_1.default.createServer(function (request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8000, function () {
    console.log((new Date()) + ' Server is listening on port 8000');
});
const wsServer = new websocket_1.server({
    httpServer: server,
    autoAcceptConnections: false
});
function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}
wsServer.on('request', function (request) {
    console.log("inside request");
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }
    var connection = request.accept("echo-protocol", request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            try {
                messageHandler(connection, JSON.parse(message.utf8Data));
            }
            catch (error) {
                console.error(error);
            }
        }
    });
    connection.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
function messageHandler(ws, message) {
    if (message.type === incomingMessage_1.IncomingSupportedMessage.JoinRoom) {
        const payload = message.payload;
        userManager.addUser(payload.name, payload.userId, payload.roomId, ws);
    }
    if (message.type === incomingMessage_1.IncomingSupportedMessage.SendMessage) {
        const payload = message.payload;
        const user = userManager.getUser(payload.roomId, payload.userId);
        if (!user) {
            console.error('user not found');
            return;
        }
        let chat = store.addChats(payload.userId, user.name, payload.roomId, payload.message);
        if (!chat) {
            return;
        }
        const outGoingPayload = {
            type: outgoingMessage_1.OutgoingSupportedMessage.AddChat,
            payload: {
                chatId: chat.id,
                roomId: payload.roomId,
                message: payload.message,
                name: user.name,
                upvote: 0
            }
        };
        userManager.broadCast(payload.roomId, payload.userId, outGoingPayload);
    }
    if (message.type === incomingMessage_1.IncomingSupportedMessage.UpvoteMessage) {
        const payload = message.payload;
        let chat = store.upvote(payload.userId, payload.roomId, payload.chatId);
        if (!chat) {
            return;
        }
        const outGoingPayload = {
            type: outgoingMessage_1.OutgoingSupportedMessage.UpdateChat,
            payload: {
                chatId: chat.id,
                roomId: payload.roomId,
                upvote: chat.upvotes.length
            }
        };
        userManager.broadCast(payload.roomId, payload.userId, outGoingPayload);
    }
}
