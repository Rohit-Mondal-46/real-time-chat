import React, { useState } from 'react'
import SingleChat from './singleChat'
import { MdSend } from 'react-icons/md';
import ChatRoomHeader from './ChatRoomHeader';




function ChatArea() {
  const [input,setInput] = useState<string>('')

  return (
    <div className='w-50 h-full bg-slate-400'>
      <ChatRoomHeader></ChatRoomHeader>
      //TODO: create store and, then map on singlechat
      <SingleChat></SingleChat>
      <SingleChat></SingleChat>
      <SingleChat></SingleChat>
      <SingleChat></SingleChat>
      <SingleChat></SingleChat>
      <SingleChat></SingleChat>
      <SingleChat></SingleChat>
      <SingleChat></SingleChat>
      <SingleChat></SingleChat>
      <form >
          <input 
          type="text" 
          value={input}
          placeholder="Enter your message..."
          onChange={(e)=>setInput(e.target.value)}
          />
          <button type="submit"><MdSend></MdSend></button>
        </form>
    </div>
  )
}

export default ChatArea