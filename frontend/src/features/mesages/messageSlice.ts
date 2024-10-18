import {createSlice} from '@reduxjs/toolkit'
import { defaultSerializeQueryArgs } from '@reduxjs/toolkit/query'

type Message = {
  roomId: string,
  message: string,
  name: string,
  upvote: string,
  chatId: string
}

const initialState = {
    messages:[] as Message[]
}

export const messageSlice = createSlice({
    name:'message',
    initialState,
    reducers:{
        sendMessage: (state,action)=>{

        },

        upvoteMessage: (state,action)=>{
            
        },

        joinRoom: (state,action)=>{

        },

        addChat: (state,action)=>{
            state.messages.push(action.payload);
        },
        
        updateChat: (state,action)=>{
            state.messages.push(action.payload);
        },
    }

})


export const {updateChat,upvoteMessage,addChat,joinRoom,sendMessage} =  messageSlice.actions

export default messageSlice.reducer;