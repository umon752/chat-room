import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../../redux/slice/userSlice'
import { updateUpload } from '../../redux/slice/uploadSlice'
import { useSocket } from '../../context/SocketContext'
import Spinner from './Spinner'

type AvatarProps = {
  size: string
}

const Avatar: React.FC<AvatarProps> = ({ size }) => {
  const dispatch = useDispatch()
  const avatarRef = useRef(null)
  const user = useSelector((state: any) => state.user)
  const isUpload = useSelector((state: any) => state.isUpload)
  const isSignIn = useSelector((state: any) => state.isSignIn)
  const socket = useSocket()

  const changeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!e.target.files) return
    
    let file = e.target.files[0]
    let reader = new FileReader()

    dispatch(
      updateUpload(true)
    )
    
    reader.onload = function () {
      if(avatarRef.current) {
        // 移除 "data:image/png;base64," 前綴
        const base64Image = typeof this.result === 'string' ? this.result.split(',')[1] : ''

        const headers = new Headers()
        headers.append('Authorization', 'Client-ID e915a85c592fa51')

        const formdata = new FormData()
        formdata.append('image', base64Image)
        formdata.append('privacy', 'hidden')

        const requestOptions: RequestInit = {
          method: 'POST',
          headers: headers,
          body: formdata,
          redirect: 'follow' as RequestRedirect,
          referrer: '',
        };

        fetch('https://api.imgur.com/3/image', requestOptions)
          .then((response) => response.json())
          .then((result) => {
            dispatch(
              updateUser({
                avatar: result.data.link
              })
            )
            if(isSignIn) {
              socket.emit('editUser', {...user, avatar: result.data.link})
            }
            dispatch(
              updateUpload(false)
            )
          })
          .catch((error) => {
            dispatch(
              updateUpload(false)
            )
            console.log('error', error)
          })
      }
    }
      
    reader.readAsDataURL(file)
  }

  return (
    <>
      <div className={`relative ${size} rounded-full overflow-hidden flex-shrink-0`}>
        <div className="u-concave u-flex-center rounded-full before:rounded-full after:rounded-full">
          <div className="parent w-95% h-95% rounded-full bg-white relative overflow-hidden dark:(bg-gray)">
            <img className="w-100% h-100% object-cover" src={user.avatar} alt="" ref={avatarRef} referrerPolicy="no-referrer" />
            <div className="w-100% h-100% u-absolute-center opacity-0 rounded-full u-transition-ease
            parent-hover:(opacity-100 u-transition-ease)">
              <div className="w-100% h-100% u-absolute-center bg-dark opacity-30"></div>
              <div className="i-ic:baseline-edit w-32 h-32 text-light u-absolute-center"></div>
            </div>
            <input type="file" className="w-100% h-100% u-absolute-center rounded-full cursor-pointer opacity-0 z-10" onChange={changeAvatar} />
            <div className="u-absolute-center">
              <Spinner active={isUpload as boolean} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Avatar
