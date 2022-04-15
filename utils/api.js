//  各个接口  users/.js

routes = {
  users: require('../routes/api/users'),
  //   profile: require('../routes/api/profile'),
  //   posts: require('../routes/api/posts'),
  blog: require('../routes/api/blog'),
  upload: require('../routes/api/upload'), //  文件上传接口
  acjson: require('../routes/api/acjson'), // 请求静态json
  mock: require('../routes/api/mock') // 请求静态json
}
module.exports = routes
