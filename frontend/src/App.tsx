import { useEffect, useState } from "react";
import "./App.css";

type Message = {
  roomId: string,
  message: string,
  name: string,
  upvote: string,
  chatId: string
}

const userId = Math.floor(Math.random() * 10000);

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [input,setInput] = useState('')
  function sendMessage(message:string){
    socket?.send(JSON.stringify({
      type: "SEND_MESSAGE",
      payload: {
        message,
        userId,
        roomId: '1',
      }
    }))
  }

  function upvoteMessage(chatId:string){
    socket?.send(JSON.stringify({
      type: "UPVOTE_MESSAGE",
      payload: {
        chatId,
        userId,
        roomId: '1',
      }
    }))
  }

  useEffect(() => {
      let ws = new WebSocket("ws://localhost:8000/", "echo-protocol");
      setSocket(ws);
  
      ws.onopen = function () {
        console.log("WebSocket Connected");
  
        ws.send(
          JSON.stringify({
            type: "JOIN_ROOM",
            payload: {
              name: "Rohit",
              userId,
              roomId: "1",
            },
          })
        );
    }
      ws.onmessage = function(e) {
        const {payload,type} = JSON.parse(e.data)
        try {
          if (type === 'ADD_CHAT') {
            setMessages((prevMessages)=>[...prevMessages,{roomId: payload.roomId,
              message: payload.message,
              name: payload.name,
              upvote: payload.upvote,
              chatId: payload.chatId}])
          }
          
          if(type === "UPDATE_CHAT"){
            setMessages(messages  => messages.map(c=>{
              if(c.chatId === payload.chatId){
                  return {
                    ...c,
                    upvote:payload.upvote,
                  }
              }
              return c;
            }))
          }

          
        }
        catch (error) {
          console.log(error);
        }
      }
      // const intervalId = setInterval(() => {
      //   if (ws.readyState === WebSocket.OPEN) {
      //     ws.send(JSON.stringify({ type: 'PING' }));
      //   }
      // }, 30000);
      ws.onerror = function(error){
        console.error('WebSocket Error in forntend: ', error);
      };

      ws.onclose = function () {
        console.log("WebSocket Closed. Attempting to reconnect...");
        setTimeout(() => {
          ws = new WebSocket("ws://localhost:8000/", "echo-protocol");
          setSocket(ws); // Reconnect
        }, 5000); // Wait 5 seconds before attempting to reconnect
      };

      return () => {
        // clearInterval(intervalId);
        ws.close()
      }
},[]);  


  function handleMessage(e){
    e.preventDefault();
    if (input.trim() === "") return;
    sendMessage(input);
    setInput('');
  }

  function handleUpvote(chatId:string){
    upvoteMessage(chatId)
  }
  return (
    <div>
      <div className="App">
        <header className="App-header">
          <h1>Real Time Chat</h1>
        </header>
        <div>
          {messages.map((message) => (
            <div className="bg-slate-500" key={message.chatId}>
              <p className="text-green-500" >{message.message}</p>
              <p className="inline">{message.upvote}</p>
              <button className="ml-4 inline" onClick={()=>handleUpvote(message.chatId)}>up</button>
            </div>
          ))}
        </div>
        <form onSubmit={handleMessage}>
          <input 
          type="text" 
          value={input}
          placeholder="Enter your message..."
          onChange={(e)=>setInput(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
