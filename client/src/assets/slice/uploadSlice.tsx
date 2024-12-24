import { createSlice } from '@reduxjs/toolkit'

export const uploadSlice = createSlice({ 
  name: 'isUpload', 
  initialState: false, 
  reducers: { 
    updateUpload(_, action) { 
      return action.payload
    }
  } 
})

export default uploadSlice.reducer
export const { updateUpload } = uploadSlice.actions
