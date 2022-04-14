//用于登录注册 接口
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const keys = require('../../config/mongondbkey')
const passport = require('passport') // 验证TOken

//  引入短信验证码接口
//node request模块安装命令：npm install request
var request = require('request')
var querystring = require('querystring')

//  引入邮箱找回密码
const nodemailer = require('nodemailer')
// require('dotenv').config();

const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

/**,
 * @swagger
 * /api/users/register:   #路由地址
 *    post:
 *      tags:
 *      -  博客系统
 *      summary:  用户注册接口
 *      description: 添加用户   #接口描述
 *      consumes:
 *      - "application/json"    #接口接收参数方式
 *      requestBody:    #编写参数接收体
 *          required: true  #是否必传
 *          content:
 *              application/json:
 *                  schema:  #参数体
 *                      type: object    #参数类型
 *                      properties:
 *                          name:
 *                                  type: string    #参数类型
 *                                  description: 用户名     #参数描述
 *                          email:
 *                                  type: string    #参数类型
 *                                  description: 性别     #参数描述
 *                          password:
 *                                  type: string    #参数类型
 *                                  description: 出生年月     #参数描述
 *                  example:        #请求参数样例。
 *                   name: "wxfeiang"
 *                   email: "wxfeiagn@qq.com"
 *                   password: "string"
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
 *
 * */
exports.register = (req, res) => {
  console.log(req.body, '---------------')
  // 查询数据库
  const { errors, isValid } = validateRegisterInput(req.body) // 解构
  // 判断是否通过
  if (!isValid) {
    return res.status(400).json(errors)
  }

  User.findOne({
    email: req.body.email
  }).then((user) => {
    if (user) {
      return res.status(400).json({
        email: '邮箱已经被注册!!!'
      })
    } else {
      // 头像地址
      const avatar = gravatar.url(req.body.email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      })
      //存
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        identity: req.body.identity,
        avatar //  es6一样只写一个
      })
      //  密码加密
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err
          newUser.password = hash
          console.log(hash)
          // 保存
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err))
        })
      })
    }
  })
}

/**,
 * @swagger
 * /api/users/login:   #路由地址
 *    post:
 *      tags:
 *      -  博客系统
 *      summary:  用户登录接口
 *      description: 登录   #接口描述
 *      consumes:
 *      - "application/json"    #接口接收参数方式
 *      requestBody:    #编写参数接收体
 *          required: true  #是否必传
 *          content:
 *              application/json:
 *                  schema:     #参数返回--
 *                      type: object    #参数类型
 *                      properties:
 *                          name:
 *                                  type: string    #参数类型
 *                                  description: 用户名     #参数描述
 *                          email:
 *                                  type: string    #参数类型
 *                                  description: 性别     #参数描述
 *                          password:
 *                                  type: string    #参数类型
 *                                  description: 出生年月     #参数描述
 *                  example:        #请求参数样例。
 *                   name: "wxfeiang"
 *                   email: "wxfeiagn@qq.com"
 *                   password: "string"
 *      responses:  #编写返回体
 *        200:     #返回code码
 *          description: 登录成功   返回信息 token   #返回code码描述
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
 *
 * */
exports.login = (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body) // 解构
  // 判断isValid是否通过
  if (!isValid) {
    return res.status(400).json(errors)
  }
  // 获取到
  const email = req.body.email
  const password = req.body.password
  // 查询是否存在
  User.findOne({
    email
  }).then((user) => {
    if (!user) {
      return res.status(400).json({
        email: '邮箱不存在!!!'
      })
    }
    // 密码匹配
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const rule = {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          identity: user.identity
        }
        //res.json({ msg: "sucess" })
        // jwt.sign("规则","加密名字","tocken 过期时间","cb")
        jwt.sign(
          rule,
          keys.secretOrKey,
          {
            expiresIn: 3600
          },
          (err, token) => {
            if (err) throw err
            res.json({
              success: true,
              // token: "mrw" + token
              token: 'Bearer ' + token //  固定格式
            })
          }
        )
      } else {
        return res.status(400).json({
          password: '密码错误!!!'
        })
      }
    })
  })
}

/**
 * @swagger
 * /api/users/current:
 *   get:
 *     tags:
 *       - 博客系统
 *     description: 需要携带 token
 *     responses:
 *       200:
 *         description: 请求成功
 *     security:
 *      - petstore_auth:
 *        - "write:pets"
 *        - "read:pets"
 */
// TODO  有验证 Token的接口  处理
exports.current =
  (passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    // res.json(req.user)
    // res.json({ msg: "sucess" })
    res.json({
      //  之前pssport.js 上返回
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      identity: req.user.identity,
      avatar: req.user.avatar
    })
  })

/**,
 * @swagger
 * /api/users/sms:   #路由地址
 *    post:
 *      tags:
 *      -  博客系统
 *      summary:  获取短信短信验证码接口
 *      description: 获取短信短信验证码接口   #接口描述
 *      consumes:
 *      - "application/json"    #接口接收参数方式
 *      requestBody:    #编写参数接收体
 *          required: true  #是否必传
 *          content:
 *              application/json:
 *                  schema:     #参数dd返回--
 *                      type: object    #参数类型
 *                      properties:
 *                          phone:
 *                                  type: string    #参数类型
 *                                  description: 用户名     #参数描述
 *
 *                  example:        #请求参数样例。
 *                   name: "wxfeiang"
 *
 *      responses:  #编写返回体
 *        200:     #返回code码
 *          description: 成功   返回信息 token   #返回code码描述
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
 *          description: 失败
 *
 * */

exports.sms = (req, res) => {
  // 对手机号码做验证
  if (req.body.phone) {
  }
  let code = Math.floor(Math.random() * 1000000)
  let queryData = querystring.stringify({
    mobile: req.body.phone, // 接受短信的用户手机号码
    tpl_id: '143678', // 您申请的短信模板ID，根据实际情况修改
    tpl_value: '#code#=' + code, // 您设置的模板变量，根据实际情况修改
    key: 'fff5a7c7be45a5e72673785d61269047' // 应用APPKEY(应用详细页查询)
  })
  var queryUrl = 'http://v.juhe.cn/sms/send?' + queryData
  request(queryUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body) // 打印接口返回内容
      var jsonObj = JSON.parse(body) // 解析接口返回的JSON内容
      //  把验证码存到 session
      return res.json(jsonObj)
    } else {
      return res.status(400).json({
        error: '后台请求短信服务平台接口异常'
      })
    }
  })
}
/**,
 * @swagger
 * /api/users/retrievePwd:   #路由地址
 *    post:
 *      tags:
 *      -  博客系统
 *      summary:  邮件找回密码
 *      description: 邮件找回密码   #接口描述
 *      consumes:
 *      - "application/json"    #接口接收参数方式
 *      requestBody:    #编写参数接收体
 *          required: true  #是否必传
 *          content:
 *              application/json:
 *                  schema:     #邮件找回密码
 *                      type: object    #参数类型
 *                      properties:
 *                          phone:
 *                                  type: string    #参数类型
 *                                  description: 用户名     #参数描述
 *
 *                  example:        #请求参数样例。
 *                   name: "wxfeiang"
 *
 *      responses:  #编写返回体
 *        200:     #返回code码
 *          description: 成功   返回信息 token   #返回code码描述
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
 *          description: 失败
 *
 * */

exports.retrievePwd = (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body) // 解构
  // 判断isValid是否通过
  // if (!isValid) {
  //     return res.status(400).json(errors);
  // }
  // 获取到
  const email = req.body.email
  const name = req.body.name
  console.log(name + '------' + email)
  User.findOne({ name }).then((user) => {
    if (!user) {
      return res.status(400).json({
        email: '邮箱不存在!!!'
      })
    } else {
      // step 1
      let transporter = nodemailer.createTransport({
        service: 'qq',
        secure: true,
        auth: {
          user: 'wxfeiang@qq.com', // 309595700@qq.com
          pass: 'wkvnvyrnixtifgea' //  邮箱的授权码
        }
      })

      // step 2
      //   希望写入html  文件
      let mailOptions = {
        from: 'wxfeiang@qq.com',
        to: req.body.email,
        subject: '找回密码',
        text: `您的用户名:${user.name},密码: ${user.password}`,
        // html: '<iframe src="https://www.baidu.com" height="400" width="700" name="demo" frameborder="0" scrolling="auto" sandbox="allow-same-origin allow-top-navigation allow-forms allow-scripts"  ></iframe>'
        html: `<iframe src="//www.runoob.com">
                <p>您的浏览器不支持  iframe 标签。</p>
              </iframe>`
      }
      //  密码是加密的需要解密  应该提示更具验证码 重新更密码  ok  功能实现了
      // <iframe src="https://www.baidu.com" height="400" width="700" name="demo" frameborder="0" scrolling="auto" sandbox="allow-same-origin allow-top-navigation allow-forms allow-scripts"  ></iframe>

      // step 3
      transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
          res.status(400).json({
            state: 'failed  发送失败',
            msg: err
          })
        } else {
          res.status(200).json({
            state: 'suc',
            msg: `密码已发送至您的邮箱${req.body.email}`
          })
        }
      })
    }
  })
}

/**
 * @swagger
 * /api/users/seeion:
 *   get:
 *     tags:
 *       - 博客系统
 *     description: 测试 session
 *     parameters:
 *      - in: body
 *      - name: user
 *        in: query
 *        description: user
 *        required: false
 *        type: integer
 *        maximum:
 *        minimum: 1
 *        format:
 *     responses:
 *       200:
 *         description: 请求成功
 */
exports.seeion = (req, res, next) => {
  var code = Math.floor(Math.random() * 1000000)
  var user = {
    name: 'Chen-xy',
    age: '22',
    address: 'bj',
    code
  }
  req.session.user = user
  console.log(req.session.user)
  res.status(200).json({
    title: 'code',
    name: 'code' + code
  })
  //req.session.destroy();
  //  req.session.destroy();

  // console.log(req);
}

/**
 * @swagger
 * /api/users/yazhen:
 *   get:
 *     tags:
 *       - 博客系统
 *     description: 测试 session
 *     parameters:
 *      - in: body
 *      - name: user
 *        in: query
 *        description: user
 *        required: false
 *        type: integer
 *        maximum:
 *        minimum: 1
 *        format:
 *     responses:
 *       200:
 *         description: 请求成功
 */
exports.yazhen = (req, res, next) => {
  console.log(req.session.user)
  if (req.session.user) {
    var user = req.session.user
    var code = user.code
    res.send('你好这是' + code + '，欢迎来到我的家园。')
  } else {
    res.send('session 过期了')
  }
}
