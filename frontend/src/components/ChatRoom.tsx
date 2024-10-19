import ChatArea from './ChatArea'
import MostVotedChats from './MostVotedChats'

function ChatRoom() {
  return (
    <div className='w-full flex-1 flex bg-red-500'>
        <ChatArea></ChatArea>
        <MostVotedChats></MostVotedChats>
    </div>
  )
}

export default ChatRoom