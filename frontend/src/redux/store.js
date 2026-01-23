import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import ownerReducer from './ownerSlice'
import mapReducer from './mapSlice'

const store = configureStore({
    reducer:{
        user: userReducer,
        owner: ownerReducer,
        map: mapReducer
    }
})

export default store