const express = require('express')
const router = express.Router()

router.get('/sokettest', (req, res) => {
  console.log('进来了------', req.io.on)

  req.io.on('connection', function (socket) {
    console.log('alguem se ligou!', socket.id)
    // socket.emit('event_from_server', { message: 'conectou-se ao servidor' })
  })
})
module.exports = router

/* io.on('connection',(socket)=> {
  console.log('实现socket连接',socket.id)

  // 获取从客户端发送的数据（chat）
  socket.on('chat',(data) => {
      io.sockets.emit('chat', data);
  })

  // 获取从客户端发送的数据（typing）
  socket.on('typing',(data)=>{
      socket.broadcast.emit('typing',data);
  })
})
 */
