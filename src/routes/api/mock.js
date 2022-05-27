//用于登录注册 接口
const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')
const { reg_mockogin } = require('../../validation/user') // 验证规则

const mockApi = require('../routes_handler/mock')

// data
router.get('/data', mockApi.mockData)
//login
router.post('/sys/login', expressJoi(reg_mockogin), mockApi.login)
// profile
router.get('/sys/profile', mockApi.profile)
// feature
router.get('/sys/feature', mockApi.feature)
// chapter
router.get('/sys/chapter', mockApi.chapter)
// userList
router.get('/userList', mockApi.userList)
// userstudent
router.get('/userstudent/', mockApi.userstudent)

// addStudent
router.post('/addStudent', mockApi.addStudent)

module.exports = router
