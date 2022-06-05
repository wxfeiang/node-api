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
// TODO  方法抽离  // 前端默认上传字段名 file
router.post('/multer', mut.muUpload.single('file'), (req, res, next) => {
  // console.log(req.body ,"接受额外的参数  ")
  if (req.file === undefined) {
    res.cc(500, '错误请选择上传文件！')
  } else {
    let resAll = {
      //  file: req.file,
      fileName: req.file.filename,
      path: `/public/upload/${req.file.filename}`
    }
    res.cc(resAll)
  }
})

//TODO上传 多文件

module.exports = router
