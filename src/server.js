const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
dotenv.config('./env')

const log4js = require('./config/logConfig')
const logger = log4js.getLogger() //根据需要获取logger
const logoth = log4js.getLogger('oth')

const { initSession, useSession } = require('./utils/session') // 使用session
const esscook = require('./utils/validata') // 验证错误级别的中间件
const res = require('./utils/rescc') //  全局返回统一数据格式的方法

const authJwt = require('./utils/jwtAuth') // 引入验证
const routes = require('./utils/api') //  各个接口  users/.js
logoth.info('文件根' + __dirname + '---------- 文件名绝对------' + __filename)
log4js.useLogger(app, logger) //这样会自动记录每次请求信息，放在其他use上面

const expressSwagger = require('express-swagger-generator')(app)
const options = require('./config/swaggers')
expressSwagger(options)

//  引入静态资源``
app.use('/api/public', express.static('public')) // 为了给静态资源文件创建一个虚拟的文件前缀(实际上文件系统中并不存在) ，可以使用 express.static 函数指定一个虚拟的静态目录
//logoth.info(app.use(express.static(path.join(__dirname, 'public'))));
// 链接mongodb数据库
// const dbConnect = require('./config/mongondbkey')()

// bodyParser 中间件使用
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)
app.use(bodyParser.json())
// 使用中间件实现允许跨域
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  next()
})
app.use(useSession) // 初始化 session
app.use(initSession)
// 封装全局的 返回统一信息处理
app.use(res.resData)
app.use(authJwt) // 路由之前初始化 token 认证

//  使用soket
const socketio = require('socket.io')
const http = require('http')
const server = http.createServer(app)
const io = socketio(server)

app.use(function (req, res, next) {
  req.io = io
  next()
})

// 引入自定义接口的所有路由
for (item in routes) {
  app.use('/api/' + item, routes[item])
}

app.use(esscook.validata) // 全局验证提交的数据  放在最后
const port = process.env.PORT || 3088
app.listen(port, () => {
  logoth.info(`Server  running  on prot  ${port}`)
})
