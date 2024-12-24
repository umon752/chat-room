type BackBtnProps = {
  clickEvent: React.MouseEventHandler<HTMLButtonElement>
}

const BackBtn: React.FC<BackBtnProps> = ({ clickEvent }) => {
  return (
    <>
      <button type="button" className="parent w-fit inline-flex flex-(items-center) opacity-70 md-(gap-2) px-12" onClick={clickEvent}>
        <div className="i-lsicon:left-outline w-22 h-22 md-(w-26 h-26) parent-hover:(text-main) dark:text-white"></div>
        <span className="font-size-14 md-(font-size-16) parent-hover:(text-main) dark:text-white">Back</span>
      </button>
    </>
  )
}

export default BackBtn
