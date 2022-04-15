const express = require('express')

const mongoose = require('mongoose')
const bodyParser = require('body-parser')

// const path = require('path') //  文件路径系统
// const fs = require('fs') //  文件系统
const { initSession, useSession } = require('./utils/session') // 使用session
const esscook = require('./utils/validata') // 验证错误级别的中间件
const res = require('./utils/rescc') //  全局返回统一数据格式的方法

const swaggerConfig = require('./config/swagger') // 引入抽离的 swagger配置文件
const authJwt = require('./utils/jwtAuth') // 引入验证

const app = express()
const routes = require('./utils/api') //  各个接口  users/.js
console.log('-----------------------------------')
console.log('文件根' + __dirname + '---------- 文件名绝对------' + __filename)
//  引入静态资源``
app.use('/api/public', express.static('public')) // 为了给静态资源文件创建一个虚拟的文件前缀(实际上文件系统中并不存在) ，可以使用 express.static 函数指定一个虚拟的静态目录
//console.log(app.use(express.static(path.join(__dirname, 'public'))));
//  链接数据库
var db = require('./config/mongondbkey').mongoURI
//  已经在服务器配置好了生产环境得变量   product
if (process.env.NODE_ENV === 'production') {
  console.log('线上生产环境 ', process.env.NODE_ENV, db)
  db = require('./config/mongondbkey').mongoURIProt
  // 链接 mongoose
  mongoose
    .connect(db, {
      useNewUrlParser: true
    })
    .then(() => console.log(process.env.NODE_ENV + '数据库链接成功'))
    .catch((err) => console.log(err))
}

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

for (item in routes) {
  // 引入接口的所有路由
  app.use('/api/' + item, routes[item])
}

app.use('/api/docs', swaggerConfig.swaggerSave, swaggerConfig.swaggerUi) // 使用 swaggerSpec 生成 swagger 文档页面，并开放在指定路由  ceshi
app.use(esscook.validata) // 全局验证提交的数据  放在最后

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server  running  on prot  ${port}`)
})
