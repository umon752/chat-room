import { AsideProvider } from '../../../context/AsideContext'
import AsideChat from './AsideChat'
import AsideMember from './AsideMember'
import AsideSettings from './AsideSettings'

const Aside: React.FC = () => {
  
  return (
    <>
      <aside className="h-40% w-100% w-100% flex-shrink-0 lg:(h-100% max-w-40vw) xxl:(max-w-30vw)">
        <div className="u-convex flex flex-(col) bg-light px-10 rounded-t-35 before:(rounded-t-35) after:(rounded-t-35) dark:bg-dark md:(rounded-s-50 before:(rounded-s-50) after:(rounded-s-50) px-12)">
          <AsideProvider>
            {/* 設定 */}
            <AsideSettings />
            {/* 成員 */}
            <AsideMember />
            {/* Chat */}
            <AsideChat />
          </AsideProvider>
        </div>
      </aside>
    </>
  )
}

export default Aside
