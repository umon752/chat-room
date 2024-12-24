import { createSlice } from '@reduxjs/toolkit'

// type Message = {
//   id: string
//   name: string
//   texts: string[][]
//   times: string[]
//   avatar: string
//   userId: string
//   isUser: boolean
// }

export const messageSlice = createSlice({ 
  name: 'messages', 
  initialState: [
    // {
    //   id: 0,
    //   name: 'Name',
    //   texts: [['test', 'QQ']],
    //   times: ['下午 2:00', '下午 2:10'],
    //   userId: '0',
    //   isUser: false,
    // },
  ], 
  reducers: { 
    updateMessages(_, action) {
      return action.payload
    },
    clearMessages(_) {
      return []
    },
  } 
})

export default messageSlice.reducer
export const { updateMessages, clearMessages } = messageSlice.actions
