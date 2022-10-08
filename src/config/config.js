/*
 * @Author: wxfeiang
 * @Description:
 * @Date: 2022-05-14 18:02:17
 * @LastEditTime: 2022-07-19 14:48:11
 * @FilePath: /node-api/src/config/config.js
 */
// 配置各种 key
const jwtConfig = {
  secretOrKey: 'wxfeiang', // 密钥
  expiresIn: 2 * 1000 * 3600 //  过期时间
}

// 配置mongodb
const mongodbConfig = {
  username: 'root',
  password: 'admin123456***',
  database: 'node-api',
  host: '47.99.93.97',
  port: '27017'
}
// 配置mysql
const mysqlConfig = {
  protocol: 'mysql',
  host: '47.99.93.97',
  user: 'root',
  password: 'admin123456***',
  port: 3306,
  database: 'imadmin'
}

module.exports = {
  jwtConfig,
  mongodbConfig,
  mysqlConfig
}
