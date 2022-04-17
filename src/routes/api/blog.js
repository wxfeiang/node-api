const express = require('express')
const router = express.Router()

const blog = require('../routes_handler/blog')

// 获取博客
router.post('/blog', blog.addblog)
// 添加简历信息
router.post('/addlevmsg', blog.addlevmsg)
//  获取所有的 个人简历信息  给前端
router.get('/getlevmsg', blog.getlevmsg)

module.exports = router
