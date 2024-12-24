type BtnProps = {
  text: string
  clickEvent: React.MouseEventHandler<HTMLButtonElement>
  disabled: boolean
}

const Btn: React.FC<BtnProps> = ({ text, clickEvent, disabled }) => {
  return (
    <>
      <button type="button" className={`parent u-convex u-convex-btn u-inline-flex-center px-24 py-12 before:(rounded-30) after:(rounded-30) ${disabled && 'pointer-events-none opacity-50'}`} onClick={clickEvent}>
        <span className="font-(size-20 black) text-dark parent-hover:(text-main) dark:text-white">{text}</span>
      </button>
    </>
  )
}

export default Btn
