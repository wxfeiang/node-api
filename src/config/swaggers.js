const dotenv = require('dotenv')
dotenv.config('../env')

let options = {
  swaggerDefinition: {
    info: {
      description: '接口管理', //
      title: 'node-api',
      version: '1.0.0'
    },
    host: process.env.PORT, //端口号，要和自己启动的node服务保持一致 // 或者localhost  '127.0.0.1:' +
    basePath: '/',
    produces: ['application/json', 'application/xml'],
    schemes: ['http', 'https'],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: '令牌token'
      }
    }
  },
  route: {
    url: '/api/docs', //route 访问的地址
    docs: '/api/swagger.json' //swagger文件 api
  },
  basedir: __dirname, //app absolute path
  files: ['../routes/routes_handler/*.js'] //files 访问api接口地址
}

module.exports = options
