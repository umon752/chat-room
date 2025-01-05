import { useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateLoading } from '../../redux/slice/loadingSlice'

const Loading: React.FC = () => {
  const dispatch = useDispatch()
  const isLoading = useSelector((state: { isLoading: boolean }) => state.isLoading)

  useLayoutEffect(() => {
    setTimeout(() => {
      dispatch(
        updateLoading(false)
      )
    }, 500);
  }, []);

  return (
    <>
      <noscript className="absolute top-0 z-9999">您的瀏覽器不支援 JavaScript 功能，若網頁功能無法正常使用時，請開啟瀏覽器 JavaScript 狀態 (Your browser does not support Javascript. For full
      functionality of this site, please enable JavaScript in your browser.)<br />
      </noscript>

      <div className={`w-100vw h-100vh bg-light dark:bg-dark overflow-hidden fixed top-0 left-0 right-0 bottom-0 z-9999 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none u-transition-ease'}`}>
        
      </div>
    </>
  )
}

export default Loading
