//用于登录注册 接口
const express = require('express')
const router = express.Router()
const users = require('../routes_handler/users')

// 1. 导入 @escook/express-joi
const expressJoi = require('@escook/express-joi')
const { reg_login } = require('../../validation/user') // 验证规则
//const passport = require('passport') // 验证TOken
//  注册接口
router.post('/register', expressJoi(reg_login), users.register)

// 登录接口
router.post('/login', users.login)

//  验证token  // TODO  有验证 Token的接口  处理
router.get(
  '/current',
  //   passport.authenticate('jwt', {
  //     session: false
  //   }),
  users.current
)
//   获取短信短信验证码接口
router.post('/sms', users.sms)

// 邮件找回密码接口
router.post('/retrievePwd', users.retrievePwd)
// 测试 session
router.get('/seeion', users.seeion)
//验证是否 session
router.get('/yazhen', users.yazhen)
// 测试生成 token
router.post('/testtoken', users.testtoken)

module.exports = router
