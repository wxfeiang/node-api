// 配置各种 key
const jwtConfig = {
  secretOrKey: 'wxfeiang', // 密钥
  expiresIn: 3600 //  过期时间
}

// 配置mongodb
const mongodbConfig = {
  username: 'root',
  password: 'admin123456',
  database: 'node-api',
  host: '47.99.93.97',
  port: '27017'
}
// 配置mysql
const mysqlConfig = {
  protocol: 'mysql',
  host: '47.99.93.97',
  user: 'root',
  password: '123456',
  port: 3306,
  database: 'student'
}

module.exports = {
  jwtConfig,
  mongodbConfig,
  mysqlConfig
}
