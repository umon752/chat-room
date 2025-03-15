import { createSlice } from '@reduxjs/toolkit'
import avatar from '/assets/images/avatar.png'

type User = {
  id: string | null
  name: string
  avatar: string
}

const initialState: User = {
  id: null,
  name: '',
  avatar: avatar,
}

export const userSlice = createSlice({ 
  name: 'user', 
  initialState, 
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
