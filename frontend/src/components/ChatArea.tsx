import  { useState } from 'react'
import SingleChat from './SingleChat'
import { MdSend } from 'react-icons/md';
import ChatRoomHeader from './ChatRoomHeader';
import {useWebSocket} from '../webSocketContext.tsx'



function ChatArea() {
  const [input,setInput] = useState<string>('')
  const {messages,sendMessage} = useWebSocket()
  function handleSendMessage(e){
    e.preventDefault();
    sendMessage(input);
    setInput('');
  }


  return (
    <div className='w-1/2 h-screen flex flex-col bg-green-200 relative'>
      <ChatRoomHeader></ChatRoomHeader>
      <div className="flex-1 overflow-y-scroll pb-10 p-2">
    {messages.map((msg) => (
      <SingleChat
        key={msg.chatId}
        message={msg.message}
        chatId={msg.chatId}
        upvote={msg.upvote}
      />
    ))}
  </div>
      <div className='w-full bg-green-200 absolute bottom-0 '>
        <form className='flex' onSubmit={handleSendMessage}>
          <input 
          type="text" 
          value={input}
          placeholder="Enter your message..."
          onChange={(e)=>setInput(e.target.value)}
          className='w-90 flex-grow mb-2 rounded-md p-2 ml-2 bg-green-50 text-black'
          />
          <button className='w-10 pb-2 pr-4'><MdSend className='w-full' type='submit' size={37} ></MdSend></button>
        </form>
      </div>
    </div>
  )
}

export default ChatArea