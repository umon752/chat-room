import React, { createContext, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import webSocket from 'socket.io-client'
import { updateMembers, clearMember } from './assets/slice/memberSlice'
import { showToast } from './assets/slice/toastSlice'
import { updateMessages, clearMessages } from './assets/slice/messageSlice'
import { addMesh, clearMeshes } from './assets/slice/meshSlice'
import { updateSignIn } from './assets/slice/signInSlice'

const SocketContext = createContext<any>(null)

export const SocketProvider: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
  const [socket, setSocket] = useState<any>(null)
  const dispatch = useDispatch()
  const user = useSelector((state: any) => state.user)
  const isSignIn = useSelector((state: any) => state.isSignIn)

  useEffect(() => {
    const socketURL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'
    const socketInstance = webSocket(socketURL)
    setSocket(socketInstance)

    socketInstance.on('updateMembers', (members) => {
      dispatch(
        updateMembers(members)
      )
    })

    socketInstance.on('addMesh', (mesh) => {
      dispatch(
        addMesh(mesh)
      )
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  useEffect(() => {
    if(!socket) return;

    socket.on('updateMessages', (messages: any[]) => {
      if(messages.length === 0) return

      const filterMessage = [...messages].map((msg) => {
        const newMsg = { ...msg }
        if(newMsg.userId === user.id) {
          newMsg.isUser = true
        } 
        // else {
        //   newMsg.isUser = false
        // }
        return newMsg
      })

      dispatch(
        updateMessages(filterMessage)
      )
    })

    socket.on('addMember', (userName: string) => {
      if(isSignIn) {
        dispatch(
          showToast({
            text: `${userName} 加入 chatroom！`,
            state: '',
          })
        )
      }
    })

    socket.on('removeMember', (userObj: { id: string; name: string }) => {
      if(isSignIn && userObj.id !== user.id) {
        dispatch(
          showToast({
            text: `${userObj.name} 離開 chatroom！`,
            state: '',
          })
        )
      }
    })

    socket.on('disconnection', () => {
      dispatch(
        clearMember()
      )
      dispatch(
        clearMessages()
      )
      dispatch(
        clearMeshes()
      )
      dispatch(
        updateSignIn(false)
      )
      showToast({
        text: `連線中斷！`,
        state: '',
      })
    })
  }, [socket, user, isSignIn])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
};

export const useSocket = () => {
  return useContext(SocketContext)
}