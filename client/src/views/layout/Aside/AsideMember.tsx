import { useSelector } from 'react-redux';
import '../../../redux/slice/memberSlice'
import { useAside } from '../../../context/AsideContext'
import BackBtn from '../../components/BackBtn'

type Member = {
  id: number
  name: string
  avatar: string
}

const AsideMember: React.FC = () => {
  const asideContext = useAside()
  if (!asideContext) {
    throw new Error('AsideMember must be used within an AsideProvider')
  }
  const { openMember, setOpenMember } = asideContext
  let members = useSelector((state: { members: any }) => state.members)

  const closeMember = () => {
    setOpenMember(false)
  }
  
  return (
    <>
      <div className={`w-100% h-100% absolute top-0 left-0 flex flex-(col) gap-10 bg-light rounded-s-50 z-5 p-10 md:(gap-14 py-30) dark:bg-dark ${openMember ? 'opacity-100' : 'opacity-0 translate-x-100%'}`}>
        <BackBtn clickEvent={closeMember} />
        <div className="u-concave rounded-12 overflow-hidden px-10 md:(px-24)">
          <div className="u-scrollbar-hidden h-100% overflow-scroll flex flex-(col) gap-14 py-10 md:(gap-10 py-24)">
            {members.map((member: Member) => 
              <div className="w-100% flex flex-(items-center) gap-10" key={member.id}>
                <div className="w-40 h-40 bg-white rounded-full overflow-hidden flex-shrink-0 md:(w-50 h-50) dark:(bg-gray)">
                  <img className="w-100% h-100% object-cover" src={member.avatar} alt="" referrerPolicy="no-referrer" />
                </div>
                <div className="w-100% font-size-14 md:(font-size-16)">{member.name}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default AsideMember
