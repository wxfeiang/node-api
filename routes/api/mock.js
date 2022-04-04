//用于登录注册 接口
const express = require('express')
const router = express.Router()

const path = require('path')

const fs = require('fs') //文件模块

const Mock = require('mockjs')

const mysql = require('mysql')
var db = require('../../config/db')
const request = require('request')

router.get('/test', (req, res) => {
  res.json({
    msg: 'loworking '
  })
})

/**
 * @swagger
 * /api/mock/data:
 *   get:
 *     tags:
 *       - mock.js
 *     description: 请求模拟数据
 *     responses:
 *       200:
 *         description: 请求成功
 *
 */
router.get('/data', (req, res, next) => {
  let data = Mock.mock({
    Code: 200,
    data: {
      'id|10000-20000': 10000, //id: 10000-20000之间的随机一个数字
      name: '@cname', //name: 随机生成一个中文名
      image: '', //image:
      'locked|1-2': false, //locked: 随机生成 true 或 false
      'address|1': ['北京市', '贵州省', '浙江省'], // role: 北京、贵州、杭州 随机三选一
      phone: /^(13|14|15|18)[0-9]\d{8}$/, //phone: 符合正则的随机字符串
      'order|10': [
        //order: 重复10次指定内容组成一个数组
        {
          'id|+1': 10000, //id从10000开始，每次+1
          orderName: '@ctitle', //orderName: 随机生成一个中文标题
          orderTime: '@datetime' //orderTime: 随机生成一个 yyyy-MM-dd HH:mm:ss 格式的时间
        }
      ],
      loginTime: function () {
        //loginTime: 函数的生成的特定返回值
        return new Date().getTime()
      }
    },
    resultMessage: '查询成功'
  })
  res.json(data)
})

/**,
 * @swagger
 * /api/mock/sys/login:
 *    post:
 *      tags:
 *      - 登陆接口
 *      summary: login
 *      produces:
 *      - application/json
 *      parameters:
 *      - name: username
 *        in: query
 *        description: 用户名
 *        required: false
 *        type: integer
 *        maximum:
 *        minimum: 1
 *        format:
 *      - name: password
 *        in: query
 *        description: md5加密密码
 *        required: false
 *        type: integer
 *        maximum:
 *        minimum: 1
 *        format:
 *      responses:
 *        200:
 *          description: successful operation
 * */

router.post('/sys/login', (req, res, next) => {
  const { username, password } = req.body
  let data = Mock.mock({
    code: 200,
    success: true,
    message: '登陆成功',
    data: {
      'id|10000-20000': 10000, //id: 10000-20000之间的随机一个数字
      name: username,
      token: password,
      loginTime: function () {
        //loginTime: 函数的生成的特定返回值
        return new Date().getTime()
      }
    }
  })
  res.json(data)
})

/**,
 * @swagger
 * /api/mock/sys/profile:
 *    get:
 *      tags:
 *      - 获取首页各种信息
 *      summary: profile
 *      produces:
 *      - application/json
 *      responses:
 *        200:
 *          description: successful operation
 * */
router.get('/sys/profile', (req, res, next) => {
  const { username, password } = req.body
  let data = {
    success: true,
    code: 200,
    data: {
      role: [
        {
          id: '1',
          title: '超级管理员'
        }
      ],
      _id: '61df3340c47fbe23ece44ed6',
      id: '612710a9ec87aa543c9c3420',
      username: 'super-admin',
      title: '超级管理员',
      avatar: 'http://47.99.93.97/api/public/upload/1642521427253.jpg',
      permission: {
        menus: ['userManage', 'roleList', 'permissionList', 'articleRanking', 'articleCreate'],
        points: ['distributeRole', 'importUser', 'removeUser', 'distributePermission']
      }
    },
    message: '获取资料成功'
  }
  res.json(data)
})

/**,
 * @swagger
 * /api/mock/sys/feature:
 *    get:
 *      tags:
 *      - 获取首页各种信息
 *      summary: feature
 *      produces:
 *      - application/json
 *      responses:
 *        200:
 *          description: successful operation
 * */

router.get('/sys/feature', (req, res) => {
  var file = path.join(__dirname, 'json/laui.json')
  fs.readFile(file, 'utf-8', function (err, data) {
    if (err) {
      res.send('文件读取失败')
    } else {
      res.send(JSON.parse(data).feature)
    }
  })
})

/**,
 * @swagger
 * /api/mock/sys/chapter:
 *    get:
 *      tags:
 *      - 获取首页各种信息
 *      summary: chapter
 *      produces:
 *      - application/json
 *      responses:
 *        200:
 *          description: successful operation
 * */

router.get('/sys/chapter', (req, res) => {
  var file = path.join(__dirname, 'json/laui.json')
  console.log('oooo')
  fs.readFile(file, 'utf-8', function (err, data) {
    if (err) {
      res.send('文件读取失败')
    } else {
      res.send(JSON.parse(data).chapter)
    }
  })
})
/**,
 * @swagger
 * /api/mock/userList:
 *    get:
 *      tags:
 *      - 获取mysql student 学生表
 *      summary: userList
 *      produces:
 *      - application/json
 *      responses:
 *        200:
 *          description: successful operation
 * */
router.get('/userList', (req, res, next) => {
  const sql = 'SELECT * FROM student'
  db.query(sql, [], function (results, fields) {
    // 以json的形式返回

    res.json({ results })
  })
})
/**,
 * @swagger
 * /api/mock/userstudent/?id='':
 *    get:
 *      tags:
 *      - 根据学生ID查到学生
 *      summary: userstudent/?id=''
 *      produces:
 *      - application/json
 *      responses:
 *        200:
 *          description: successful operation
 * */
router.get('/userstudent/:id', (req, res, next) => {
  const sql = `SELECT * FROM student WHERE Sid=${req.params.id}`
  db.query(sql, [], function (results, fields) {
    // 以json的形式返回

    res.json({ results })
  })
})
/**,
 * @swagger
 * /api/mock/addStudent':
 *    get:
 *      tags:
 *      - 添加学生
 *      summary: /addStudent'
 *      produces:
 *      - application/json
 *      responses:
 *        200:
 *          description: successful operation
 * */
router.post('/addStudent', (req, res, next) => {
  const { Sname, Sage, Ssex } = req.body
  const prms = [Sname, Sage, Ssex]
  const sql = `INSERT INTO student (Sname, Sage, Ssex)   VALUES(?,?,?);`
  db.query(sql, prms, function (results, fields) {
    // 以json的形式返()

    const flog = results.affectedRows > 0
    var data = {
      success: flog ? true : false,
      message: flog ? '成功' : '失败'
    }
    res.json(data)
  })
})
module.exports = router
