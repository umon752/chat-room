import { createSlice } from '@reduxjs/toolkit'

type Member = {
  id: number
  name: string
  avatar: string
}

export const memberSlice = createSlice({ 
  name: 'members', 
  initialState: [] as Member[],
  reducers: {
    updateMembers(_, action) {
      return action.payload
    },
    clearMember(_) {
      return []
    },
  } 
})

export default memberSlice.reducer
export const { updateMembers, clearMember } = memberSlice.actions
