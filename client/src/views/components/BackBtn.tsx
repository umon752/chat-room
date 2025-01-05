import { useTranslation } from 'react-i18next'

type BackBtnProps = {
  clickEvent: React.MouseEventHandler<HTMLButtonElement>
}

const BackBtn: React.FC<BackBtnProps> = ({ clickEvent }) => {
  const { t } = useTranslation()

  return (
    <>
      <button type="button" className="parent w-fit inline-flex flex-(items-center) opacity-70 md-(gap-2) px-12" onClick={clickEvent}>
        <div className="i-lsicon:left-outline w-22 h-22 md-(w-26 h-26) u-transition-ease parent-hover:(text-main u-transition-ease) dark:text-white"></div>
        <span className="font-size-14 md-(font-size-16) u-transition-ease parent-hover:(text-main u-transition-ease) dark:text-white">{t('back')}</span>
      </button>
    </>
  )
}

export default BackBtn
