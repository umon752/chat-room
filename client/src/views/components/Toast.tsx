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
          hideToast()
        )
      }, 3000)
    }
  }, [toast]);

  return (
    <>
      <div className={`u-transition-ease min-w-100 max-w-300 fixed top-50% left-50% translate-x--50% z-9998 opacity-0 pointer-events-none translate-y--30% ${toast.active && 'opacity-100 pointer-events-auto translate-y--50%'}`}>
        <div className="u-convex bg-light rounded-20 flex flex-(col items-center) p-30 dark:bg-dark">
          {
            toast.state && <div className={`${iconState[toast.state]} text-main mb-8`}></div>
          }
          <div className="text-center font-(size-18 bold)">{toast.text}</div>
        </div>
      </div>
    </>
  )
}

export default Toast
