const express = require('express')

const mongoose = require('mongoose')
const bodyParser = require('body-parser')

// const path = require('path') //  文件路径系统
// const fs = require('fs') //  文件系统

const esscook = require('./utils/validata') // 验证错误级别的中间件

const swaggerConfig = require('./config/swagger') // 引入抽离的 swagger配置文件

//  引入静态资源``

const app = express()
//  各个接口  users/.js
const users = require('./routes/api/users')
//const profile = require('./routes/api/profile')
//const posts = require('./routes/api/posts')
const blog = require('./routes/api/blog')

const upload = require('./routes/api/upload') //  文件上传接口
const acjson = require('./routes/api/acjson') // 请求静态json
const mock = require('./routes/api/mock') // 请求静态json

console.log('-----------------------------------')
console.log('文件根' + __dirname + '---------- 文件名绝对------' + __filename)

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

const { initSession, useSession } = require('./utils/session')
app.use(useSession)

app.use(initSession)
// 封装全局的 返回统一信息处理
const res = require('./utils/rescc')
app.use(res.resData)

const authJwt = require('./utils/jwtAuth')
app.use(authJwt) // 路由之前初始化 token 认证

// 初始化
// app.use(passport.initialize())
// require('./config/passport')(passport) // 数据分离

app.use('/api/users', users) // 上面引入进来的
//app.use('/api/profile', profile)
//app.use('/api/posts', posts)
app.use('/api/blog', blog)
app.use('/api/acjson', acjson)
app.use('/api/upload', upload)
app.use('/api/mock', mock)

app.use('/api/docs', swaggerConfig.swaggerSave, swaggerConfig.swaggerUi) // 使用 swaggerSpec 生成 swagger 文档页面，并开放在指定路由  ceshi

app.use(esscook.validata) // 全局验证提交的数据  放在最后

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server  running  on prot  ${port}`)
})
