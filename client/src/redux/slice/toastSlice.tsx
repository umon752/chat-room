import { createSlice } from '@reduxjs/toolkit'

type Toast = {
  text: string
  state: string | null
  active: boolean
}

const initialState: Toast = {
  text: '',
  state: null,
  active: false,
}

export const toastSlice = createSlice({ 
  name: 'toast', 
  initialState, 
  reducers: { 
    showToast(_, action) {
      return {
        ...action.payload,
        active: true,
      }
    },
    hideToast(state) {
      return {
        ...state,
        active: false,
      }
    },
  } 
})

export default toastSlice.reducer
export const { showToast, hideToast } = toastSlice.actions
