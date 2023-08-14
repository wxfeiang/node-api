/*
 * @Author: wxfeiang
 * @Description:
 * @Date: 2022-05-14 18:20:35
 * @LastEditTime: 2023-08-14 10:43:07
 * @FilePath: /node-api/src/server.js
 */
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
//const { Decrypt } = require('./utils/encry')
dotenv.config('./env')

// require('./routes/api/soket')(server)

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
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header('Access-Control-Allow-Origin', '*')
  //允许的header类型
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Accept,Content-type')
  res.header('Access-Control-Allow-Credentials', true)
  //跨域允许的请求方式
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Content-Type', 'application/json;charset=utf-8')
  if (req.method.toLowerCase() == 'options') res.sendStatus(200) //让options尝试请求快速结束
  else {
    next()
  }
})
app.use(useSession) // 初始化 session
app.use(initSession)
// 封装全局的 返回统一信息处理
app.use(res.resData)
app.use(authJwt) // 路由之前初始化 token 认证
//
// app.use((req, res, next) => {
//   if (req.body) {
//     req.body = Decrypt(req.body.data)
//   }
//   if (req.query) {
//     req.query = Decrypt(req.query.data)
//   }
//   //

//   next()
// })

// 引入自定义接口的所有路由
for (item in routes) {
  app.use('/api/' + item, routes[item])
}

app.use(esscook.validata) // 全局验证提交的数据  放在最后
const port = process.env.PORT || 3088
app.listen(port, () => {
  console.log(`Server  running  on prot  ${port}`)
  logoth.info(`Server  running  on prot  ${port}`)
})
