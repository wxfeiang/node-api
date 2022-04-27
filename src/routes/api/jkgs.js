//用于登录注册 接口
const express = require('express')
const router = express.Router()
const jkgs = require('../routes_handler/jkgs')

// 1. 导入 @escook/express-joi
const expressJoi = require('@escook/express-joi')
const { reg_jkgsuser, reg_jkgsquerUser } = require('../../validation/jkgs') // 验证规则

// 添加jkmsg
router.post('/jkgsAdduser', expressJoi(reg_jkgsuser), jkgs.jkgsAdduser)
//

router.post('/jkgsquerUser', expressJoi(reg_jkgsquerUser), jkgs.jkgsquerUser)

module.exports = router
