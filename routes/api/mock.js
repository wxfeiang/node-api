//用于登录注册 接口
const express = require('express')
const router = express.Router()

const mockApi = require('../routes_handler/mock')
// test
router.get('/test', mockApi.test)
// data
router.get('/data', mockApi.mockData)
//login
router.post('/sys/login', mockApi.login)
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
