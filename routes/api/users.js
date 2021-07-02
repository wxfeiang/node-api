//用于登录注册 接口
const express = require('express')
const router = express.Router()
const User = require('../../models/User')
//const bcrypt = require("bcrypt");
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const passport = require('passport')

//  引入短信验证码接口
//node request模块安装命令：npm install request
var request = require('request')
var querystring = require('querystring')

//  引入邮箱找回密码
const nodemailer = require('nodemailer')
// require('dotenv').config();

const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

// $route  GET api/users/test
// @desc   返回的请求的json数据
// @access public
router.get('/test', (req, res) => {
  res.json({
    msg: 'loworking ',
  })
})
// $route  post api/users/test
// @desc   返回的请求的json数据
// @access public   注册接口
router.post('/register', (req, res) => {
   console.log(req.body,"---------------")
  // 查询数据库
  const { errors, isValid } = validateRegisterInput(req.body) // 解构
  // 判断是否通过
  if (!isValid) {
    return res.status(400).json(errors)
  }

  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (user) {
      return res.status(400).json({
        email: '邮箱已经被注册!!!',
      })
    } else {
      // 头像地址
      const avatar = gravatar.url(req.body.email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      })
      //存
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        identity: req.body.identity,
        avatar, //  es6一样只写一个
      })
      //  密码加密
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err
          newUser.password = hash
          console.log(hash)
          // 保存
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err))
        })
      })
    }
  })
})
// $route  post api/users/login
// @desc   jwt tocan
// @access public 登录接口
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body) // 解构
  // 判断isValid是否通过
  if (!isValid) {
    return res.status(400).json(errors)
  }
  // 获取到
  const email = req.body.email
  const password = req.body.password
  // 查询是否存在
  User.findOne({
    email,
  }).then((user) => {
    if (!user) {
      return res.status(400).json({
        email: '邮箱不存在!!!',
      })
    }
    // 密码匹配
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const rule = {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          identity: user.identity,
        }
        //res.json({ msg: "sucess" })
        // jwt.sign("规则","加密名字","tocken 过期时间","cb")
        jwt.sign(
          rule,
          keys.secretOrKey,
          {
            expiresIn: 3600,
          },
          (err, token) => {
            if (err) throw err
            res.json({
              success: true,
              // token: "mrw" + token
              token: 'Bearer ' + token, //  固定格式
            })
          }
        )
      } else {
        return res.status(400).json({
          password: '密码错误!!!',
        })
      }
    })
  })
})

// $route  get api/users/current
// @desc
// @access public   请求当前信息
//  验证token
router.get(
  '/current',
  passport.authenticate('jwt', {
    session: false,
  }),
  (req, res) => {
    // res.json(req.user)
    // res.json({ msg: "sucess" })
    res.json({
      //  之前pssport.js 上返回
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      identity: req.user.identity,
      avatar: req.user.avatar,
    })
  }
)
//   获取短信短信验证码接口
router.post('/sms', (req, res) => {
  // 对手机号码做验证
  if (req.body.phone) {
  }
  var code = Math.floor(Math.random() * 1000000)
  var queryData = querystring.stringify({
    mobile: req.body.phone, // 接受短信的用户手机号码
    tpl_id: '143678', // 您申请的短信模板ID，根据实际情况修改
    tpl_value: '#code#=' + code, // 您设置的模板变量，根据实际情况修改
    key: 'fff5a7c7be45a5e72673785d61269047', // 应用APPKEY(应用详细页查询)
  })
  var queryUrl = 'http://v.juhe.cn/sms/send?' + queryData
  request(queryUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body) // 打印接口返回内容
      var jsonObj = JSON.parse(body) // 解析接口返回的JSON内容
      //  把验证码存到 session
      return res.json(jsonObj)
    } else {
      return res.status(400).json({
        error: '后台请求短信服务平台接口异常',
      })
    }
  })
})
// 提交短信验证码接口

// 邮件找回密码接口
router.post('/retrievePwd', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body) // 解构
  // 判断isValid是否通过
  // if (!isValid) {
  //     return res.status(400).json(errors);
  // }
  // 获取到
  const email = req.body.email
  const name = req.body.name
  console.log(name + '------' + email)
  User.findOne({ name }).then((user) => {
    if (!user) {
      return res.status(400).json({
        email: '邮箱不存在!!!',
      })
    } else {
      // step 1
      let transporter = nodemailer.createTransport({
        service: 'qq',
        secure: true,
        auth: {
          user: 'wxfeiang@qq.com', // 309595700@qq.com
          pass: 'wkvnvyrnixtifgea', //  邮箱的授权码
        },
      })

      // step 2
      //   希望写入html  文件
      let mailOptions = {
        from: 'wxfeiang@qq.com',
        to: req.body.email,
        subject: '找回密码',
        text: `您的用户名:${user.name},密码: ${user.password}`,
        // html: '<iframe src="https://www.baidu.com" height="400" width="700" name="demo" frameborder="0" scrolling="auto" sandbox="allow-same-origin allow-top-navigation allow-forms allow-scripts"  ></iframe>'
        html: `<iframe src="//www.runoob.com">
                <p>您的浏览器不支持  iframe 标签。</p>
              </iframe>`,
      }
      //  密码是加密的需要解密  应该提示更具验证码 重新更密码  ok  功能实现了
      // <iframe src="https://www.baidu.com" height="400" width="700" name="demo" frameborder="0" scrolling="auto" sandbox="allow-same-origin allow-top-navigation allow-forms allow-scripts"  ></iframe>

      // step 3
      transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
          res.status(400).json({
            state: 'failed  发送失败',
            msg: err,
          })
        } else {
          res.status(200).json({
            state: 'suc',
            msg: `密码已发送至您的邮箱${req.body.email}`,
          })
        }
      })
    }
  })
})
// 测试 session
router.get('/seeion', (req, res, next) => {
  var code = Math.floor(Math.random() * 1000000)
  var user = {
    name: 'Chen-xy',
    age: '22',
    address: 'bj',
    code,
  }
  req.session.user = user
  console.log(req.session.user)
  res.status(200).json({
    title: 'code',
    name: 'code' + code,
  })
  //req.session.destroy();
  //  req.session.destroy();
  console.log('------------------------')
  // console.log(req);
})
//验证是否 session
router.get('/yazhen', (req, res, next) => {
  console.log(req.session.user)
  if (req.session.user) {
    var user = req.session.user
    var code = user.code
    res.send('你好这是' + code + '，欢迎来到我的家园。')
  } else {
    res.send('session 过期了')
  }
})

module.exports = router
