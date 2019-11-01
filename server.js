const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
//  引入cook  session
var cookieParser = require('cookie-parser');
var session = require('express-session');

const app = express();
//   各个接口  users/.js
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const blog = require('./routes/api/blog');
const wx_jddata = require('./routes/api/wx_jddata');
console.log('-----------------------------------');
console.log(process.env.NODE_ENV);

console.log('-----------------------------------');
// 请求静态json
const acjson = require('./routes/api/acjson');
//DB
const db = require('./config/keys').mongoURI;
//const db = require('./config/keys').mongoURIProt;

mongoose
    .connect(db, {
        useNewUrlParser: true
    })
    .then(() => console.log('数据库链接成功'))
    .catch(err => console.log(err));
// Connect to mongodb

// bodyParser 中间件使用
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

// 使用中间件实现允许跨域
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    next();
});
//  我感觉初始化   session
app.use(cookieParser('sessiontest'));
// 使用
// app.use(
//     session({
//         secret: 'sessiontest', //与cookieParser中的一致
//         resave: true,
//         saveUninitialized: true
//     })
// );
// 使用 session 中间件
app.use(
    session({
        secret: 'sessiontest', // 对session id 相关的cookie 进行签名
        resave: true,
        saveUninitialized: false, // 是否保存未初始化的会话
        cookie: {
            maxAge: 5000 // 设置 session 的有效时间，单位毫秒
        }
    })
);

// 初始化
app.use(passport.initialize());
require('./config/passport')(passport); // 数据分离

//  根路径
app.get('/', (req, res) => {
    res.send('这里是项目跟路径'); //
});

app.use('/api/users', users); // 上面引入进来的
app.use('/api/profile', profile);
app.use('/api/posts', posts);
app.use('/api/blog', blog);
app.use('/api/acjson', acjson);
app.use('/api/wx_jddata', wx_jddata);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server  running  on prot  ${port}`);
});