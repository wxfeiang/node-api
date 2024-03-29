const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const path = require('path') //  文件路径系统
const fs = require('fs') //  文件系统
//  引入cook  session
var cookieParser = require('cookie-parser')
var session = require('express-session')

// const mysql = require('mysql')

const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')
const options = {
  definition: {
    // swagger 采用的 openapi 版本 不用改
    openapi: '3.0.3',
    // swagger 页面基本信息 自由发挥
    info: {
      title: '后台管理系统接口',
      version: '创建时间：2021年07月02日'
    }
  },
  apis: [path.join(__dirname, './routes/api/*.js')] //这里指明接口路由存放的文件夹。楼主放在根路径的router下
}
const swaggerSpec = swaggerJSDoc(options)
//  引入静态资源``

const app = express()
//   各个接口  users/.js
const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')
const blog = require('./routes/api/blog')
const wx_jddata = require('./routes/api/wx_jddata')
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
}
mongoose
  .connect(db, {
    useNewUrlParser: true
  })
  .then(() => console.log(process.env.NODE_ENV + '数据库链接成功'))
  .catch((err) => console.log(err))
// Connect to mongodb

// const connection = mysql.createConnection({
//   protocol: 'mysql',
//   host: '47.99.93.97',
//   user: 'root',
//   password: '123456',
//   port: 3306,
//   database: 'student'
// })

// connection.connect(function (err) {
//   if (err) {
//     console.log('连接错误', err)
//     return
//   }
//   console.log('成功连接MySQL')
// })

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
//  初始化   session
app.use(cookieParser('sessiontest'))
// 使用 session 中间件
app.use(
  session({
    secret: 'sessiontest', // 对session id 相关的cookie 进行签名 与cookieParser中的一致
    resave: true,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie: {
      maxAge: 50000 // 设置 session 的有效时间，单位毫秒
    },
    secure: true
  })
)

// 初始化
app.use(passport.initialize())
require('./config/passport')(passport) // 数据分离

//根路径
app.get('/', (req, res) => {
  console.log('根路径接口')
  res.send('这里是项目跟路径') //
})

// app.get('/', (req, res) => {
//     res.sendFile(
//         path.resolve(__dirname, '../www', 'blogadmin/dist', 'index.html')
//     );
// });
// 读取整个文件夹
// 阿里云服务器测试
app.use('/api/users', users) // 上面引入进来的
app.use('/api/profile', profile)
app.use('/api/posts', posts)
app.use('/api/blog', blog)
app.use('/api/acjson', acjson)
app.use('/api/wx_jddata', wx_jddata)
app.use('/api/upload', upload)
app.use('/api/mock', mock)

// 使用 swaggerSpec 生成 swagger 文档页面，并开放在指定路由  ceshi
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server  running  on prot  ${port}`)
})
