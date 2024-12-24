import { useState, useContext } from 'react'
import { useSelector } from 'react-redux';
import { AsideContext } from './AsideContext'
import BackBtn from '../../components/BackBtn'
import Avatar from '../../components/Avatar'

const AsideSettings: React.FC = () => {
  const context = useContext(AsideContext)
  if (!context) {
    throw new Error('AsideSettings must be used within an AsideProvider')
  }
  const { openSettings, setOpenSettings } = context
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const user = useSelector((state: { user: any }) => state.user)

  const switchMode = () => {
    setDarkMode(prev => !prev)
    document.body.classList.toggle('dark')
  }

  const closeSettings = () => {
    setOpenSettings(false)
  }
  
  return (
    <>
      <div className={`w-100% h-100% absolute top-0 left-0 flex flex-(col) gap-10 bg-light rounded-s-50 z-5 p-10 md:(gap-14 py-30) dark:bg-dark ${openSettings ? 'opacity-100' : 'opacity-0 translate-x-100%'}`}>
        <BackBtn clickEvent={closeSettings} />
        <div className="h-100% rounded-12 overflow-hidden px-24">
          <div className="h-100% u-scrollbar-hidden h-100% overflow-scroll flex flex-(col) gap-24">
            <div className="w-100% h-100% flex flex-(col items-center justify-center) gap-8 md:(gap-18)">
              <Avatar size="w-100 h-100 md:(w-145 h-145)" />
              <div className="w-100% text-center text-dark font-size-14 md:(font-size-16) dark:text-white">{user.name}</div>
              <div className="flex flex-(col items-center) gap-8">
                <button type="button" className="w-48 h-20 overflow-hidden relative md:(w-74 h-36)" onClick={switchMode}>
                  <div className="u-concave rounded-full bg-white before:rounded-full after:rounded-full dark:bg-dark"></div>
                  <div className="w-13 h-13 absolute top-50% left-0 translate-y--50% mx-3 dark:translate-x-28 md:(w-20 h-20 mx-8 dark:translate-x-34)">
                    <div className="u-convex rounded-full bg-light before:rounded-full after:rounded-full dark:bg-white"></div>
                  </div>
                </button>
                <div className="font-(size-12) text-gray md:(font-size-14) dark:text-light">{darkMode ? 'Dark Mode' : 'Light Mode'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AsideSettings
