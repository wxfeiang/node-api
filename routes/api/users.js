//用于登录注册 接口
const express = require('express')
const router = express.Router()
const users = require('../routes_handler/users')

//  注册接口
router.post('/register', users.register)

// 登录接口
router.post('/login', users.login)

//  验证token
router.get('/current', users.current)
//   获取短信短信验证码接口
router.post('/sms', users.sms)
// 提交短信验证码接口

// 邮件找回密码接口
router.post('/retrievePwd', users.retrievePwd)
// 测试 session
router.get('/seeion', users.seeion)
//验证是否 session
router.get('/yazhen', users.yazhen)

module.exports = router
