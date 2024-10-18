import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ChatRoom from './components/ChatRoom.tsx'
import {Provider} from 'react-redux'
import store from './app/store.ts'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      {/* <App /> */}
      <ChatRoom></ChatRoom>
    </Provider>
  </StrictMode>,
)
