const express = require('express')
const router = express.Router()

// router.get('/sokettest', (req, res) => {
//   console.log('进来了------', req.io.on)

//   req.io.on('connection', function (socket) {
//     console.log('alguem se ligou!', socket.id)
//     // socket.emit('event_from_server', { message: 'conectou-se ao servidor' })
//   })
// })
// module.exports = router

module.exports = (server) => {
  console.log('-----http://localhost:3000dddddd')
  const io = require('socket.io')(server)

  io.on('connection', (socket) => {
    // socket.on('online', ...)
    console.log('alguem se ligou!', socket.id)
  })
}