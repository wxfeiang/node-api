// token 认证解析

const expressJwt = require('express-jwt')
const { jwtConfig } = require('../config/config')

console.log(process.env.NODE_ENV, '--jjj--')
// 配置本地测试不需要 JWT  pm2 会启动环境  默认登录接口不需要
let blackArr = []
if (process.env.NODE_ENV === 'development') {
  blackArr = [
    { url: /^\/api\/acjson\/.*/ } // 有用
  ]
}

const authJwt = expressJwt({
  secret: jwtConfig.secretOrKey, //加密密钥，可换
  algorithms: ['HS256'], //
  credentialsRequired: true, // 校验
  getToken: function fromHeaderOrQuerystring(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1]
    } else if (req.query && req.query.token) {
      return req.query.token
    } else if (req.headers['access-token'] && req.headers['access-token'].split(' ')[0] === 'Bearer') {
      return req.headers['access-token'].split(' ')[1]
    }
    return null
  }
}).unless({
  path: ['/api/users/login', '/api/mock/sys/login', '/api/users/multer', '/api/jkgs/jkgsAdduser', ...blackArr] //添加不需要token验证的路由
})
module.exports = authJwt

// 认证失败的信息放放到统一失败消息处理

//  各种过滤规则
// path: [
//   '/userSession',
//   '/salesmanSession',
//   '/adminSession',
//   '/superAdminSession',
//   '/swiper',
//   '/freeSalesman',
//   '/headImg',
//   { url: '/admin', methods: ['GET', 'POST'] },
//   { url: /^\/salesman\/.*/, methods: ['GET'] },
//   { url: '/productsCate', methods: ['GET'] },
//   { url: '/products', methods: ['GET'] },
//   { url: /^\/products\/.*/, methods: ['GET'] },
//   { url: '/user', methods: ['POST'] },
//   { url: /^\/user\/.*/, methods: ['GET'] },
//    { url: /^\/api\/acjson\/.*/ }  // 有用
// ]
