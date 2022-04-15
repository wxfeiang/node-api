// token 认证解析

const expressJwt = require('express-jwt')
const keys = require('../config/config')

const authJwt = expressJwt({
  secret: keys.secretOrKey, //加密密钥，可换
  algorithms: ['HS256'], //
  credentialsRequired: true // 校验
}).unless({
  path: [/^\/api/] //添加不需要token验证的路由  api开头的不需要验证
  // path: ['/api/login', '/api/addUser', '/api/test'] //添加不需要token验证的路由
})
module.exports = authJwt

// 认证失败的信息放放到统一失败消息处理
