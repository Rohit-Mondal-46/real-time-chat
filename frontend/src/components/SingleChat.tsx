import { FaArrowUp } from 'react-icons/fa';
import {useWebSocket} from '../webSocketContext.tsx'

function SingleChat({message,chatId,upvote}) {
  const {upvoteMessage} = useWebSocket()

  return (
          <div className='max-w-80 w-fit min-w-14 min-h-12  relative px-3 ml-1 pt-1 mb-4 rounded-xl text-white bg-blue-600'>
            <p className='mb-4 text-lg'>{message}</p>
            <div className='flex text-black absolute bottom-0 right-0 justify-between'>
              <p className='mr-1'>{upvote}</p>
              <button onClick={()=>upvoteMessage(chatId)}><FaArrowUp></FaArrowUp></button>
            </div>
          </div>
  )
}

export default SingleChat