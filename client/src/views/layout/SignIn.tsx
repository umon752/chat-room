import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { updateLoading } from '../../redux/slice/loadingSlice'
import { updateUser } from '../../redux/slice/userSlice'
import { showToast } from '../../redux/slice/toastSlice'
import { updateSignIn } from '../../redux/slice/signInSlice'
import { useSocket } from '../../context/SocketContext'
import Btn from '../components/Btn'
import Screen from './Screen'
import Aside from './Aside/Aside'
import Avatar from '../components/Avatar'
import { v4 as uuidv4 } from 'uuid'

const SignIn: React.FC = () => { 
  const { t, i18n } = useTranslation()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const user = useSelector((state: any) => state.user)
  const isUpload = useSelector((state: any) => state.isUpload)
  const isSignIn = useSelector((state: any) => state.isSignIn)
  const socket = useSocket()
  const dispatch = useDispatch()
  const userId = uuidv4()
  const isSignInRef = useRef(isSignIn)
  const userRef = useRef(user)
  const [lang, setLang] = useState<string>(i18n.language)
  
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
          text: `${t('placeholder.name')}!`,
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

  const changeLang = (lng: string) => {
    i18n.changeLanguage(lng);
    setLang(lng);
  }

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
            <div className="w-100% max-w-350 flex flex-(col items-center justify-center) gap-12 md:(gap-18)">
              <div className="text-(center dark) font-(size-28 black)">{t('signin')}</div>
              <Avatar size="w-100 h-100 md:(w-145 h-145)" />
              <div className="u-concave rounded-30 py-8 px-12 md:(py-12 px-16)">
                <input placeholder={t('placeholder.name')} className={`w-100% line-height-150% text-dark font-size-16 middle dark:text-white`} ref={inputRef} onKeyDown={keyDownEnter}></input>
              </div>
              <Btn text={t('confirm')} clickEvent={clickSignIn} disabled={isUpload} />
              <div className="u-flex-center mt-10 gap-8">
                <div className="font-(size-12) md:(font-size-14)  text-gray dark:text-light">{t('language')}</div>
                <button type="button" className="font-(size-12) md:(font-size-14) text-dark-gray dark:text-light @hover:(text-main)"  onClick={() => changeLang(lang === 'en' ? t('zh') : t('en'))}>{lang === 'en' ? t('zh') : t('en')}</button>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default SignIn
