//  引入cook  session
const cookieParser = require('cookie-parser')
const session = require('express-session')

//  初始化   session
const initSession = cookieParser('sessiontest')
// 使用 session 中间件
const useSession = session({
  secret: 'sessiontest', // 对session id 相关的cookie 进行签名 与cookieParser中的一致
  resave: true,
  saveUninitialized: false, // 是否保存未初始化的会话
  cookie: {
    maxAge: 50000 // 设置 session 的有效时间，单位毫秒
  },
  secure: true
})

module.exports = {
  initSession,
  useSession
}
