const path = require('path') // 文件路径
const fs = require('fs') //文件模块
const Mock = require('mockjs') //
const mysqldb = require('../../utils/mysqldb') // 数据库

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
exports.mockData = (req, res) => {
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
}
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
 *      - in: body
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

exports.login = (req, res) => {
  const { username, password } = req.body
  console.log(req.body)
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
}

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
exports.profile = (req, res) => {
  const { username, password } = req.body
  let data = {
    success: true,
    code: 200,
    data: {
      role: [
        {
          id: '12',
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
}

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

exports.feature = (req, res) => {
  var file = path.join(__dirname, 'json/laui.json')
  fs.readFile(file, 'utf-8', function (err, data) {
    if (err) {
      res.send('文件读取失败')
    } else {
      res.send(JSON.parse(data).feature)
    }
  })
}

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

exports.chapter = (req, res) => {
  var file = path.join(__dirname, 'json/laui.json')
  console.log('oooo')
  fs.readFile(file, 'utf-8', function (err, data) {
    if (err) {
      res.send('文件读取失败')
    } else {
      res.send(JSON.parse(data).chapter)
    }
  })
}
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
exports.userList = (req, res) => {
  const sql = 'SELECT * FROM student'
  mysqldb.query(sql, [], function (results, fields) {
    // 以json的形式返回
    res.cc('成功', results)
  })
}
/**,
 * @swagger
 * /api/mock/userstudent/:
 *    get:
 *      tags:
 *      - 获取mysql student 学生表
 *      summary: ?id= ''
 *      produces:
 *      - application/json
 *      parameters:
 *      - name: id
 *        in: query
 *        description: 用户名
 *        required: false
 *        type: integer
 *        maximum:
 *        minimum: 1
 *        format:
 *      responses:
 *        200:
 *          description: successful operation
 * */
exports.userstudent = (req, res) => {
  const sql = `SELECT * FROM student WHERE Sid= ?`
  const parm = [req.query.id]
  mysqldb.query(sql, parm, function (results, fields) {
    // 以json的形式返回

    res.json({ results })
  })
}
/**,
 * @swagger
 * /api/mock/addStudent:   #路由地址
 *    post:
 *      tags:
 *      - 获取mysql student 学生表
 *      summary: 添加用户   #接口备注
 *      description: 添加用户   #接口描述
 *      consumes:
 *      - "application/json"    #接口接收参数方式
 *      requestBody:    #编写参数接收体
 *          required: true  #是否必传
 *          content:
 *              application/json:
 *                  schema:     #参数--
 *                      type: object    #参数类型
 *                      properties:
 *                          Sname:
 *                                  type: string    #参数类型
 *                                  description: 用户名     #参数描述
 *                          Ssex:
 *                                  type: string    #参数类型
 *                                  description: 性别     #参数描述
 *                          Sage:
 *                                  type: string    #参数类型
 *                                  description: 出生年月     #参数描述
 *                  example:        #请求参数样例。
 *                      Sname: "string"
 *                      Ssex: "string"
 *                      Sage: "string"
 *      responses:  #编写返回体
 *        200:     #返回code码
 *          description: 注册成功     #返回code码描述
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          code:   #返回的code码
 *                              type: string
 *                              description: 返回code码
 *                          msg:    #返回体信息。***注意写的位置一定要和res_code对齐。
 *                               type: string   #返回体信息类型
 *                               description: 返回信息
 *                          data:
 *                                type: object
 *                                description: 返回数据
 *        -1:
 *          description: 注册失败
 *      security:
 *      - petstore_auth:
 *        - "write:pets"
 *        - "read:pets"
 *
 * */
exports.addStudent = (req, res) => {
  console.log(req.body)
  //TODO  验证传入的参数  注释写法问题
  const { Sname, Sage, Ssex } = req.body
  if (!Sname || !Sage || !Ssex) {
    res.json('参数不能为空')
    return false
  }
  const prms = [Sname, Sage, Ssex]
  const sql = `INSERT INTO student(Sname, Sage, Ssex) VALUES(?,?,?);`
  mysqldb.query(sql, prms, function (results, fields) {
    // 以json的形式返()
    const flog = results.affectedRows > 0
    var data = {
      success: flog ? true : false,
      message: flog ? '成功' : '失败'
    }
    res.json(data)
  })
}
