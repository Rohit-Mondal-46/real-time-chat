import {configureStore} from '@reduxjs/toolkit'
import messageReducer from '../features/mesages/messageSlice'
import connectionReducer from '../features/websocketConnection/connectionSlice'
import websocketMiddleware from '../middleware/wsMiddleware'

export default configureStore({
    reducer: {
        wsConnection: messageReducer,
        wsMessage: connectionReducer,
    },
    middleware:(getDefaultMiddleware:any) => getDefaultMiddleware.concat(websocketMiddleware()),
})

