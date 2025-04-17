type BtnProps = {
  text: string
  clickEvent: React.MouseEventHandler<HTMLButtonElement>
  disabled: boolean
}

const Btn: React.FC<BtnProps> = ({ text, clickEvent, disabled }) => {
  return (
    <>
      <button type="button" className={`parent u-convex u-convex-btn u-inline-flex-center rounded-30 py-8 px-12 md:(py-12 px-24) ${disabled ? 'pointer-events-none opacity-50' : ''}`} onClick={clickEvent}>
        <span className="font-(size-20 black) text-dark u-transition-ease parent-hover:(text-main u-transition-ease) dark:text-white">{text}</span>
      </button>
    </>
  )
}

export default Btn
