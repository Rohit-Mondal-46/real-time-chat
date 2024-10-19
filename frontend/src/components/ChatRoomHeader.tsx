import { useState } from 'react'

function ChatRoomHeader() {
    const[onlinePeople,setOnlinePeople] = useState<number>(0)

  return (
    <div className='w-full bg-black flex justify-between text-white'>
        <h3>Room Name:</h3>
        <p>Online({onlinePeople})</p>
    </div>
  )
}

export default ChatRoomHeader