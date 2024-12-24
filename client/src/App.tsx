import { SocketProvider } from './SocketContext'
import SignIn from './views/layout/SignIn'
import Toast from './views/components/Toast'

const App: React.FC = () => {

  return (
    <>
      <SocketProvider>
        <div className="bg-light text-dark dark:(bg-dark text-white)">
          <SignIn />
          <Toast state="" text="" active={false} />
        </div>
      </SocketProvider>
    </>
  )
}

export default App
