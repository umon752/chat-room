type SpinnerProps = {
  active: boolean
}

const Spinner: React.FC<SpinnerProps> = ({ active }) => {
  return (
    <>
      <div className={`w-24 h-24 text-main i-svg-spinners-gooey-balls-2 opacity-0 ${active && 'opacity-100'}`}></div>
    </>
  )
}

export default Spinner
