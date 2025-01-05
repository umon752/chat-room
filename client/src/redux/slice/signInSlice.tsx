import { createSlice } from '@reduxjs/toolkit'

export const isSignInSlice = createSlice({ 
  name: 'isSignIn', 
  initialState: false, 
  reducers: { 
    updateSignIn(_, action) { 
      return action.payload
    }
  } 
})

export default isSignInSlice.reducer
export const { updateSignIn } = isSignInSlice.actions
