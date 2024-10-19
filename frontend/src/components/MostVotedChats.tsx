import SingleChat from './SingleChat'
import {useWebSocket} from '../webSocketContext.tsx'
import { useState } from 'react'
function MostVotedChats() {
  const {messages} = useWebSocket()
  // const {impMessage,setImpMessage} = useState<number>(0);

  return (
    <div className='w-1/2 h-screen border-x-4 flex flex-col bg-green-200 relative'>
      <h5 className='text-center bg-black text-white'>Important Messages</h5>
      <div className='flex-1 overflow-y-auto p-2'>
        {
          messages.map((msg)=>(
            (Number(msg.upvote) > 1)?
              <SingleChat message={msg.message} chatId={msg.chatId} upvote={msg.upvote}></SingleChat>:null
          ))
        }
      </div>
    </div>
  )
}

export default MostVotedChats