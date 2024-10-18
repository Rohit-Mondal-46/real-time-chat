import {
  wsConnect,
  wsConnectionError,
  wsDisconnect,
} from "../features/websocketConnection/connectionSlice";
import {
  joinRoom,
  addChat,
  updateChat,
  upvoteMessage,
  sendMessage,
} from "../features/mesages/messageSlice";

const websocketMiddleware = () => {
  let socket;

  return (storeAPI: any) => (next: any) => (action: any) => {
    switch (action.type) {
      case wsConnect.type:
        if (socket) {
          socket.close();
        }

        socket = new WebSocket("ws://localhost:8000/", "echo-protocol");

        socket.onopen = () => {
          console.log("WebSocket connected");
          storeAPI.dispatch(joinRoom(action.payload));
        };

        socket.onmessage = (event) => {
          const message = JSON.parse(event.data);
          storeAPI.dispatch(addChat(message));
        };

        socket.onclose = () => {
          storeAPI.dispatch(wsDisconnect());
          console.log("WebSocket disconnected");
        };

        socket.onerror = (error) => {
          storeAPI.dispatch(wsConnectionError(error.message));
        };

        break;

      case wsDisconnect.type:
        if (socket) {
          socket.close();
        }
        break;

      case sendMessage.type:
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(action.payload));
        }
        break;

      default:
        break;
    }

    return next(action);
  };
};

export default websocketMiddleware;
