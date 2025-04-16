import { useState } from 'react'
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'
import { useAside } from '../../../context/AsideContext'
import BackBtn from '../../components/BackBtn'
import Avatar from '../../components/Avatar'

const AsideSettings: React.FC = () => {
  const { t, i18n } = useTranslation()
  const asideContext = useAside()
  if (!asideContext) {
    throw new Error('AsideSettings must be used within an AsideProvider')
  }
  const { openSettings, setOpenSettings } = asideContext
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [lang, setLang] = useState<string>(i18n.language)
  const user = useSelector((state: { user: any }) => state.user)

  const switchMode = () => {
    setDarkMode(prev => !prev)
    document.body.classList.toggle('dark')
  }

  const closeSettings = () => {
    setOpenSettings(false)
  }

  const changeLang = (lng: string) => {
    i18n.changeLanguage(lng);
    setLang(lng);
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
                  <div className="u-concave rounded-full bg-white dark:bg-dark"></div>
                  <div className="w-13 h-13 absolute top-50% left-0 translate-y--50% mx-3 dark:translate-x-28 md:(w-20 h-20 mx-8 dark:translate-x-34) u-transition-ease">
                    <div className="u-convex rounded-full bg-light dark:bg-white u-transition-ease"></div>
                  </div>
                </button>
                <div className="font-(size-12) text-gray md:(font-size-14) dark:text-light">{darkMode ? t('darkMode') : t('lightMode')}</div>
              </div>

              <div className="u-flex-center gap-8">
                <div className="font-(size-12) md:(font-size-14)  text-gray dark:text-light">{t('language')}</div>
                <button type="button" className="font-(size-12) md:(font-size-14) text-dark-gray dark:text-light @hover:(text-main)"  onClick={() => changeLang(lang === 'en' ? t('zh') : t('en'))}>{lang === 'en' ? t('zh') : t('en')}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AsideSettings
