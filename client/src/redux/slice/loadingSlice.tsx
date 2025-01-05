import { createSlice } from '@reduxjs/toolkit'

export const loadingSlice = createSlice({ 
  name: 'isLoading', 
  initialState: true, 
  reducers: { 
    updateLoading(_, action) { 
      return action.payload
    }
  } 
})

export default loadingSlice.reducer
export const { updateLoading } = loadingSlice.actions
