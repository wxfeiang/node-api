const express = require('express')
const router = express.Router()
const acjocn = require('../routes_handler/acjson')
// 1. 导入 @escook/express-joi
const expressJoi = require('@escook/express-joi')
const { outheSerch, outheDetl, outheData } = require('../../validation/acjson') // 验证规则
// 请求 layui
router.get('/layui', acjocn.layui)
// 请求html    文件
router.get('/email', acjocn.email)
// 爬取网页数据
router.get('/chinaData', acjocn.chinaData)

router.get('/outheSerch', expressJoi(outheSerch), acjocn.outheSerch)
router.get('/outheType', acjocn.outheType)
router.get('/outheData', expressJoi(outheData), acjocn.outheData)
router.get('/outheDetl', expressJoi(outheDetl), acjocn.outheDetl)

router.get('/outheMenu', acjocn.outheMenu)

router.get('/weibo', acjocn.weibo)
module.exports = router
