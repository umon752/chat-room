import { configureStore } from '@reduxjs/toolkit'
import loadingReducer from './slice/loadingSlice'
import messageReducer from './slice/messageSlice'
import meshReducer from './slice/meshSlice'
import memberReducer from './slice/memberSlice'
import userReducer from './slice/userSlice'
import toastReducer from './slice/toastSlice'
import uploadReducer from './slice/uploadSlice'
import signIndReducer from './slice/signInSlice'

export const store = configureStore({
  reducer: { 
    isLoading: loadingReducer,
    messages: messageReducer, 
    meshes: meshReducer,
    members: memberReducer,
    user: userReducer,
    toast: toastReducer,
    isUpload: uploadReducer,
    isSignIn: signIndReducer,
  }
})