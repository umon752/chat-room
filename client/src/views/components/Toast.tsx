import { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { hideToast } from '../../redux/slice/toastSlice'

type ToastProps = {
  state: string
  text: string
  active: boolean
}

const Toast: React.FC<ToastProps> = () => {
  const toast = useSelector((state: { toast: ToastProps }) => state.toast)
  const dispatch = useDispatch()

  const iconState: Record<string, string> = {
    null: '',
    success: 'i-ph:check-circle',
    warning: 'i-quill:warning-alt',
  };
  
  useEffect(() => {
    if(toast.active) {
      setTimeout(() => {
        dispatch(
          hideToast({active: false})
        )
      }, 3000)
    }
  }, [toast]);

  return (
    <>
      <div className={`u-transition-ease min-w-100 max-w-300 fixed top-50% left-50% translate-x--50% z-9998 ${toast.active ? 'opacity-100 pointer-events-auto translate-y--50% u-transition-ease' : 'opacity-0 pointer-events-none translate-y--30%'}`}>
        <div className="u-convex bg-light rounded-20px flex flex-(col items-center) p-30px before:(rounded-20px) after:(rounded-20px) dark:bg-dark">
          {
            toast.state !== 'null' ? <div className={`${iconState[toast.state]} text-main mb-8`}></div> : ''
          }
          <div className="text-center font-(size-18 bold)">{toast.text}</div>
        </div>
      </div>
    </>
  )
}

export default Toast
