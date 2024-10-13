import { useEffect, useState } from 'react'
import './App.css'

function App() {
  return (
    const [messages,setMessages] = useState<string[]>([])
    useEffect(() => {
      
    }, [messages])
    
    <>
      <div className="App">
        <header className="App-header">
          <h1>Real Time Chat</h1>
        </header>
        <div>
          <input type="text" placeholder="Enter your message" />
          <button>Send</button>
        </div>
        <div>
          {messages.map((message, index) => (
            <div key={index}>{message}</div>
          ))}
        </div>
      </div>
    
    </>
    
    
  )
}

export default App
