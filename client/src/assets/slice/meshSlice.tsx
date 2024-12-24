import { createSlice } from '@reduxjs/toolkit'

type Mesh = {
  id: string
  texts: string[]
  position: number[]
}

export const meshSlice = createSlice({ 
  name: 'meshes', 
  initialState: [
    // {
    //   id: 0,
    //   texts: ['test', 'QQ'],
    //   position: [0, 0, 0],
    // }
  ] as Mesh[], 
  reducers: { 
    addMesh(state, action) {
      return [action.payload, ...state]
    },
    removeMesh(_, action) {
      return action.payload
    },
    clearMeshes(_) {
      return []
    },
  } 
})

export default meshSlice.reducer
export const { addMesh, removeMesh, clearMeshes } = meshSlice.actions
