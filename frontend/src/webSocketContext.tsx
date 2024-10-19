import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type Message = {
  roomId: string;
  message: string;
  name: string;
  upvote: string;
  chatId: string;
};


interface webSocketContextType {
  messages: Message[];
  sendMessage: (Message: string) => void;
  upvoteMessage: (chatId: string) => void;
  connect: ()=> void;
  disconnect: ()=> void;
}


const userId = Math.floor(Math.random() * 10000);

const webSocketContext = createContext<webSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const sendMessage = (message: string) => {
    socket?.send(
      JSON.stringify({
        type: "SEND_MESSAGE",
        payload: {
          message,
          userId,
          roomId: "1",
        },
      })
    );
  };

  const upvoteMessage = (chatId: string) => {
    socket?.send(
      JSON.stringify({
        type: "UPVOTE_MESSAGE",
        payload: {
          chatId,
          userId,
          roomId: "1",
        },
      })
    );
  };

  const connect = () => {
    if (!socket) {
      const ws = new WebSocket("ws://localhost:8000/", "echo-protocol");
      setSocket(ws);
    }
  };

  // Function to close the WebSocket connection
  const disconnect = () => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
  };

  useEffect(() => {
    if(socket){
        socket.onopen = function () {
      console.log("WebSocket Connected");

      socket.send(
        JSON.stringify({
          type: "JOIN_ROOM",
          payload: {
            name: "Rohit",
            userId,
            roomId: "1",
          },
        })
      );
    };
    socket.onmessage = function (e) {
      const { payload, type } = JSON.parse(e.data);
      try {
        if (type === "ADD_CHAT") {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              roomId: payload.roomId,
              message: payload.message,
              name: payload.name,
              upvote: payload.upvote,
              chatId: payload.chatId,
            },
          ]);
        }

        if (type === "UPDATE_CHAT") {
          setMessages((messages) =>
            messages.map((c) => {
              if (c.chatId === payload.chatId) {
                return {
                  ...c,
                  upvote: payload.upvote,
                };
              }
              return c;
            })
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    socket.onerror = function (error) {
      console.error("WebSocket Error in forntend: ", error);
    };

    // socket.onclose = function () {
    //   console.log("WebSocket Closed. Attempting to reconnect...");
    //   setTimeout(() => {
    //     socket = new WebSocket("ws://localhost:8000/", "echo-protocol");
    //     setSocket(socket); // Reconnect
    //   }, 5000); // Wait 5 seconds before attempting to reconnect
    // };

    return () => {
      socket.close();
    };
}
  }, [socket]);
  return (
    <webSocketContext.Provider value={{ messages, sendMessage, upvoteMessage,connect,disconnect}}>
      {children}
    </webSocketContext.Provider>
  );
};

export const useWebSocket = (): webSocketContextType => {
  const context = useContext(webSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

