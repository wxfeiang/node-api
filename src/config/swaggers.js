const dotenv = require('dotenv')
dotenv.config('../env')

// swagger 需要根据本地服务和线上区分IP端口
const currentIP = process.env.HOST || 'localhost'
const host = process.env.HOST ? '' : currentIP + ':' + process.env.PORT

let options = {
  swaggerDefinition: {
    info: {
      title: 'node-api',
      version: '2.0.0', // require("../../package.json").version,
      description: '接口管理,所有的接口加入了Token ,以具体的返回值为准！' //
    },
    host, //端口号，要和自己启动的node服务保持一致 // 或者localhost  '127.0.0.1:' +
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
