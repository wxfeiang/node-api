const path = require('path') //  文件路径系统
const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')
const options = {
  definition: {
    // swagger 采用的 openapi 版本 不用改
    openapi: '3.0.3',
    // swagger 页面基本信息 自由发挥
    info: {
      title: '后台管理系统接口',
      version: '创建时间：2021年04月12日'
    }
  },
  apis: [path.join(__dirname, '../routes/routes_handler/*.js')] //这里指明接口路由存放的文件夹 放在根路径的router下
}

const swaggerSpec = swaggerJSDoc(options)

module.exports = {
  swaggerSave: swaggerUi.serve,
  swaggerUi: swaggerUi.setup(swaggerSpec)
}

/**
 * 
 * const swaggerConfig = require('./config/swagger') // 引入抽离的 swagger配置文件

 * app.use('/api/docs', swaggerConfig.swaggerSave, swaggerConfig.swaggerUi) // 使用 swaggerSpec 生成 swagger 文档页面，并开放在指定路由  ceshi

 */
