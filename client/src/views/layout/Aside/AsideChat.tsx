import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useAside } from '../../../context/AsideContext'
import { useSocket } from '../../../context/SocketContext'
import logo from '/assets/images/logo.svg'

type Message = {
  id: string
  name: string
  texts: string[][]
  times: string[]
  avatar: string
  userId: string
  isUser: boolean
}

type Mesh = {
  id: string
  texts: string[]
  position: number[]
}

let textareaBaseH = 0

const AsideChat: React.FC = () => {
  const { t } = useTranslation()
  const asideContext = useAside()
  if (!asideContext) {
    throw new Error('AsideChat must be used within an AsideProvider')
  }
  const messages = useSelector((state: any) => state.messages)
  const members = useSelector((state: any) => state.members)

  const { setOpenMember, setOpenSettings } = asideContext
  // const [messages, setMessages] = useState<Array<Message>>([
  //   {
  //     id: 0,
  //     name: 'Name',
  //     texts: ['test', 'testtesttest'],
  //     times: ['下午 2:00', '下午 2:10'],
  //     userId: '0',
  //     isUser: false,
  //   },
  // ]);
  const textareaRef = useRef<null>(null)
  const [textareaH, setTextareaH] = useState<Number>(textareaBaseH)
  const [isShift, setIsShift] = useState<Boolean>(false)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const user = useSelector((state: any) => state.user)
  const socket = useSocket()
  let prevMessageLength = messages.length

  useLayoutEffect(() => {
    if(window.innerWidth >= 768) {
      textareaBaseH = 24
    } else {
      textareaBaseH = 18
    }
    setTextareaH(textareaBaseH)
  },[])

  // textarea 高度
  useEffect(() => {
    if (textareaRef.current) {
      (textareaRef.current as HTMLTextAreaElement).style.height = `${textareaH}px`
    }
  }, [textareaH])

  useEffect(() => {
    if (contentRef.current) {
      if(messages.length === prevMessageLength) return
      prevMessageLength = messages.length
    }
  }, [messages])

  const scrollToBottom = () => {
    if (contentRef.current) {
      const contentH = contentRef.current.scrollHeight
      contentRef.current.scrollTo({
        top: contentH,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    setTimeout(scrollToBottom, 100)
  }, [])

  const changeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const lines = e.target.value.split('\n').length
    const newHeight = Math.min(lines, 5) * textareaBaseH

    setTextareaH(newHeight)
  };

  const keyDownMessage = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !isShift) e.preventDefault()
    if (e.key === 'Shift') {
      setIsShift(true)
    }
  };

  const kenUpMessage = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !isShift) {
      sendMessage()
    }
    if(e.key === 'Shift') {
      setIsShift(false)
    }
  };

  const sendMessage = () => {
    if (textareaRef.current) {
      const textareaEl = textareaRef.current ? textareaRef.current : null

      if(textareaEl) {
        const textareaValue = (textareaEl as HTMLTextAreaElement).value.trim()
        
        if(textareaValue.length === 0) return

        const formattedText = (): string[] => {          
          return textareaValue.split('\n').map((line) => line.trim()) // 返回字符串数组
        }

        const formattedTime = (): string => {
          const date = new Date(Date.now())
          const hours = date.getHours()
          const minutes = date.getMinutes().toString().padStart(2, '0')
          
          const period = hours >= 12 ? t('pm') : t('am')
          const formattedHours = hours % 12 || 12 // 12H

          return `${period} ${formattedHours}:${minutes}`
        }
        const newMessage: Message = {
          id: new Date(Date.now()).toISOString(),
          name: user.name,
          texts: [formattedText()],
          times: [formattedTime()],
          avatar: user.avatar,
          userId: user.id,
          isUser: false,
        }
        
        const newMesh: Mesh = {
          id: new Date(Date.now()).toISOString(),
          texts: formattedText(),
          position: [0, 0, 0],
        }
        
        if (socket && typeof socket.emit === 'function') {
            socket.emit('updateMessages', newMessage)
            socket.emit('addMesh', newMesh)
        } else {
            console.error('Socket is not initialized or emit is not a function')
        }
        
        (textareaRef.current as HTMLInputElement).value = ''
        setTextareaH(textareaBaseH)
        // 捲軸置底
        setTimeout(scrollToBottom, 100)
      }
    }
  }

  const openMember = () => {
    setOpenMember(true)
  }

  const openSettings = () => {
    setOpenSettings(true)
  }
  
  return (
    <>
      <div className="flex flex-(items-center justify-between) gap-12 py-10 px-12 md:(py-20 px-18)">
        <div>
          <h1 className="u-flex-center gap-4 rounded-rb-30 mb-4 before:(rounded-rb-30) after:(rounded-rb-30) md:(gap-6)">
            <img className="w-auto h-16 object-contain md:(h-24)" src={logo} alt="CHATROOM LOGO" />
            <span className="font-(size-12 black) text-main block md:(font-size-14)">CHATROOM</span>
          </h1>
          <div className="font-(size-11) text-gray dark:text-light md:(font-size-14)">{t('member', { count: members.length})}</div>
        </div>
        <ul className="flex flex-(items-center) gap-8 md:(gap-10)">
          <li className="w-30 h-30 md:(w-42 h-42)">
            <button type="button" className="parent u-convex u-convex-btn u-flex-center rounded-full before:(rounded-full) after:(rounded-full)" onClick={openMember}>
              <div className="i-mdi:people u-transition-ease text-gray w-18 h-18 parent-hover:(text-main) dark:text-light md:(w-22 h-22)"></div>
            </button>
          </li>
          <li className="w-30 h-30 md:(w-42 h-42)">
            <button type="button" className="parent u-convex u-convex-btn u-flex-center rounded-full before:(rounded-full) after:(rounded-full)" onClick={openSettings}>
              <div className="i-ic:baseline-settings u-transition-ease text-gray w-18 h-18 parent-hover:(text-main) dark:text-light md:(w-22 h-22)"></div>
            </button>
          </li>
        </ul>
      </div>
      <div className="u-concave rounded-12 overflow-hidden px-10 before:(rounded-12) after:(rounded-12) md:(px-24)">
        <div className="u-scrollbar-hidden h-100% overflow-scroll flex flex-(col) gap-14 py-10 md:(gap-24 py-24)" ref={contentRef}>
        {messages.map((message: Message, msgindex: number) => 
          <div className={`flex gap-10 md:(gap-14) ${message.isUser && 'flex-(row-reverse)'}`} key={message.id ? message.id : msgindex}>
            <div className="w-40 h-40 rounded-full bg-white overflow-hidden flex-shrink-0 md:(w-50 h-50) dark:(bg-gray)">
              <img className="w-100% h-100% object-cover" src={message.avatar} alt="" referrerPolicy="no-referrer" />
            </div>
            <div className="w-100% flex flex-(col) gap-4">
              <div className={`font-(size-10) text-gray dark:text-light ${message.isUser && 'ms-auto'}`}>{message.name}</div>
              {
                message.texts.map((text, i) => 
                  (i === 0) ?
                  (<div className={`flex gap-3 flex-(items-end) md:(gap-4) ${message.isUser && 'flex-row-reverse'}`}  key={i}>
                    <div className={`u-chat font-size-14 md:(font-size-16) u-chat-start ${message.isUser && 'u-chat-end'}`}>
                    {text.map((txt, index) => 
                        <span key={index}>{txt}</span>
                      )}
                    </div>
                    <div className="font-(size-10) text-gray flex-shrink-0 dark:text-light">{message.times[i]}</div>
                  </div>) :
                  (<div className={`flex gap-4 flex-(items-end) ${message.isUser && 'flex-row-reverse'}`} key={i}>
                    <div className="u-chat">
                      {text.map((txt, index) => 
                        <span key={index}>{txt}</span>
                      )}
                    </div>
                    <div className="font-(size-10) text-gray flex-shrink-0 dark:text-light">{message.times[i]}</div>
                  </div>)
                )
              }
            </div>
          </div>
        )}
        </div>
      </div>
      <div className="flex flex-(items-center justify-between) py-10 px-12 md:(py-20 px-18)">
        <div className="u-concave rounded-s-30 py-8 px-12 before:(rounded-s-30) after:(rounded-s-30) md:(p-16)">
          <textarea placeholder={t('placeholder.msg')} className={`u-scrollbar-hidden w-100% h-${textareaH} line-height-150% text-dark font-size-14 middle dark:text-white md:(font-size-16)`} onChange={changeMessage} onKeyDown={keyDownMessage} onKeyUp={kenUpMessage} ref={textareaRef}></textarea>
        </div>
        <div className="w-50 h-100% flex-shrink-0 md:(w-64)">
          <button type="button" className="parent u-convex u-convex-btn u-flex-center rounded-e-30 before:(rounded-e-30) after:(rounded-e-30)" onClick={sendMessage}>
            <div className="i-carbon:send-filled u-transition-ease text-gray w-20 h-20 parent-hover:(text-main) dark:text-light md:(w-26 h-26)"></div>
          </button>
        </div>
      </div>
    </>
  )
}

export default AsideChat
