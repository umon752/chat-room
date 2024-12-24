import { createSlice } from '@reduxjs/toolkit'
import avatar from '/assets/images/avatar.png'

export const userSlice = createSlice({ 
  name: 'user', 
  initialState: {
    id: null,
    name: '',
    avatar: avatar,
  }, 
  reducers: { 
    updateUser(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  } 
})

export default userSlice.reducer
export const { updateUser } = userSlice.actions
