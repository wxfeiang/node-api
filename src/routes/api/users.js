//用于登录注册 接口
const express = require('express')
const router = express.Router()
const users = require('../routes_handler/users')

// 1. 导入 @escook/express-joi
const expressJoi = require('@escook/express-joi')
const { reg_login } = require('../../validation/user') // 验证规则

const mut = require('../../config/multer')
//const passport = require('passport') // 验证TOken
//  注册接口
router.post('/register', expressJoi(reg_login), users.register)

// 登录接口
router.post('/login', expressJoi(reg_login), users.login)

//   获取短信短信验证码接口
router.post('/sms', users.sms)

// 邮件找回密码接口
router.post('/retrievePwd', users.retrievePwd)
// 测试 session
router.get('/seeion', users.seeion)
//验证是否 session
router.get('/yazhen', users.yazhen)
// 测试生成 token
router.get('/testtoken', users.testtoken)
// TODO  方法抽离
router.post('/multer', mut.muUpload.single('file'), (req, res, next) => {
  if (req.file === undefined) {
    res.cc(500, '错误请选择上传文件！')
  } else {
    res.cc({
      msg: '文件已上传成功！',
      file: `uploads/${req.file.filename}`
    })
  }
})

module.exports = router
