import ChatRoom from "./components/ChatRoom.tsx";
import { useWebSocket } from "./webSocketContext.tsx";

function App() {
  const { connect, disconnect } = useWebSocket();

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="h-16 bg-black flex items-center space-x-4 p-2">
        <button
          onClick={connect}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Connect
        </button>
        <button
          onClick={disconnect}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Disconnect
        </button>
      </div>
      <div className="flex-1 overflow-y-auto bg-green-100">
        <ChatRoom />
      </div>
    </div>
  );
}

export default App;
