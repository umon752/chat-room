import { useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateLoading } from '../../assets/slice/loadingSlice'
import { updateUser } from '../../assets/slice/userSlice'
import { showToast } from '../../assets/slice/toastSlice'
import { updateSignIn } from '../../assets/slice/signInSlice'
import { useSocket } from '../../SocketContext'
import Btn from '../components/Btn'
import Screen from './Screen'
import Aside from './Aside/Aside'
import Avatar from '../components/Avatar'
import { v4 as uuidv4 } from 'uuid'

const SignIn: React.FC = () => { 
  const inputRef = useRef<HTMLInputElement | null>(null)
  const user = useSelector((state: any) => state.user)
  const isUpload = useSelector((state: any) => state.isUpload)
  const isSignIn = useSelector((state: any) => state.isSignIn)
  const socket = useSocket()
  const dispatch = useDispatch()
  const userId = uuidv4()
  const isSignInRef = useRef(isSignIn)
  const userRef = useRef(user)
  
  useEffect(() => {
    userRef.current = user
  }, [user])

  useEffect(() => {
    isSignInRef.current = isSignIn
  }, [isSignIn])

  useEffect(() => {
    dispatch(
      updateUser({id: userId})
    )
  }, [])

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isSignInRef.current) {
        dispatch(
          updateSignIn(false)
        )
        dispatch(
          updateLoading(true)
        )
        socket.emit('removeMember', userRef.current)
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [socket])

  const clickSignIn = () => {
    if (inputRef.current && !inputRef.current.value) {
      dispatch(
        showToast({
          text: 'Please enter name!',
          state: 'warning',
        })
      )
      return
    }

    if(isUpload) return;

    const newUser = {
      id: user.id,
      name: inputRef.current ? inputRef.current.value : '',
      avatar: user.avatar
    }

    dispatch(
      updateUser(newUser)
    )
    
    socket.emit('addMember', newUser)
    
    dispatch(
      updateSignIn(true)
    )
  }

  const keyDownEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      clickSignIn()
    }
  };

  return (
    <>
      {
        isSignIn ? 
        <div className="w-100% h-dvh flex flex-(col) lg:flex-row">
          <Screen />
          <Aside />
        </div>
        :
        <div className={`w-100vw h-100vh bg-light dark:bg-dark overflow-hidden fixed top-0 left-0 right-0 bottom-0 u-transition-ease z-9998`}>
          <div className="w-100% h-100% flex-col u-flex-center">
            <div className="w-100% max-w-350 flex flex-(col items-center justify-center) gap-8 md:(gap-18)">
              <div className="text-(center dark) font-(size-28 black)">SIGN IN</div>
              <Avatar size="w-100 h-100 md:(w-145 h-145)" />
              <div className="u-concave rounded-30 py-8 px-12 before:(rounded-30) after:(rounded-30) md:(p-16)">
                <input placeholder="Please enter name" className={`u-scrollbar-hidden w-100% line-height-150% text-dark font-size-14 middle md:(font-size-16) dark:text-white`} ref={inputRef} onKeyDown={keyDownEnter}></input>
              </div>
              <Btn text={'Comfirm'} clickEvent={clickSignIn} disabled={isUpload} />
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default SignIn
