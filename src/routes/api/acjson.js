const express = require('express')
const router = express.Router()
const acjocn = require('../routes_handler/acjson')
// 请求 layui
router.get('/layui', acjocn.layui)
// 请求html    文件
router.get('/email', acjocn.email)
// 爬取网页数据
router.get('/chinaData', acjocn.chinaData)
module.exports = router
