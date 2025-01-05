import { createSlice } from '@reduxjs/toolkit'

export const toastSlice = createSlice({ 
  name: 'toast', 
  initialState: {
    text: '',
    state: null,
    active: false,
  }, 
  reducers: { 
    showToast(_, action) {
      return {
        ...action.payload,
        active: true,
      }
    },
    hideToast(_, action) {
      return {
        ...action.payload,
      }
    },
  } 
})

export default toastSlice.reducer
export const { showToast, hideToast } = toastSlice.actions
