import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    connected: false,
    error: null,
}

const connectionSlice = createSlice({
    name: 'connection',
    initialState,
    reducers: {
        wsConnect: (state)=>{
            state.connected = true;
            state.error = null;
        },
        
        wsDisconnect:(state)=>{
            state.connected = false
            state.error = null;
        },

        wsConnectionError: (state,action) =>{
            state.error = action.payload;
            state.connected = false;
        },
    }
})

export const {wsConnect,wsDisconnect,wsConnectionError} = connectionSlice.actions;
export default connectionSlice.reducer;