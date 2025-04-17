require('dotenv').config()
const express = require('express')
const cors = require('cors')
const http = require('http')
const socketIo = require('socket.io')
const app = express()

const PORT = process.env.PORT || 3000

// 將 express 放進 http 中開啟 Server 的 3000 port ，正確開啟後會在 console 中印出訊息
const server = http.createServer(app)

// members 用來存放所有的會員資料
let members = [];
// messages 用來存放所有的訊息資料
let messages = [];

const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
})

/*上方為此寫法的簡寫：
  const socket = require('socket.io')
  const io = socket(server)
*/

// 使用 CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: true
}))

// 監聽 Server 連線後的所有事件，並捕捉事件 socket 執行
io.on('connection', (socket) => {
  console.log('success server connect!')
  socket.on('addMember', (userObj) => {
    const hasIndex = members.findIndex(member => member.id === userObj.id)
    if(hasIndex !== -1) {
      members[hasIndex] = userObj
    } else {
      members.push(userObj)
    }
    io.sockets.emit('addMember', userObj.name)
    io.sockets.emit('updateMembers', members)
    io.sockets.emit('updateMessages', messages)
  });

  socket.on('removeMember', (userObj) => {
    members = members.filter(member => member.id !== userObj.id)
    io.sockets.emit('updateMembers', members)
    io.sockets.emit('removeMember', userObj)
  });

  socket.on('updateMessages', (message) => {
    // 如果新訊息和最後一筆資料是同一個人的話
    function handleSameUserMessage(newMessage) {
      const updatedMessages = [...messages]
      const lastIndex = updatedMessages.length - 1
      
      if (lastIndex >= 0 && updatedMessages[lastIndex].userId === newMessage.userId) {
        const lastMessage = {
          ...updatedMessages[lastIndex],
          texts: [...updatedMessages[lastIndex].texts, ...newMessage.texts],
          times: [...updatedMessages[lastIndex].times, ...newMessage.times],
        };
        updatedMessages[lastIndex] = lastMessage
      } else {
        updatedMessages.push(newMessage)
      }
      return updatedMessages
    }

    messages = handleSameUserMessage(message)
    io.sockets.emit('updateMessages', messages)
  });

  socket.on('addMesh', (mesh) => {
    // console.log('addMesh mesh:', mesh)
    io.sockets.emit('addMesh', mesh)
  });

  socket.on('editUser', (userObj) => {
    // console.log('editUser:', userObj)
    members = members.map(member => {
      if(member.id === userObj.id) {
        member = userObj
      }
      return member
    })

    messages = messages.map(msg => {
      if(msg.userId === userObj.id) {
        msg.avatar = userObj.avatar;
      }
      return msg
    })

    // console.log('messages', messages)
    io.sockets.emit('updateMembers', members)
    io.sockets.emit('updateMessages', messages)
  });
})

io.on('disconnection', (socket) => {
  members = []
  messages = []
  io.sockets.emit('disconnection')
})

// 啟動
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})