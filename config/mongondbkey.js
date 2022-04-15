const mongoose = require('mongoose')

const { mongodbConfig } = require('../config/config')
const { host, database, username, password, port } = mongodbConfig
// 'mongodb://nodeproduct:nodeproduct123456@127.0.0.1/nodeproduct',
//  mongodb://${username}:${password}@${host}:${port}:/${database}`
// TODO  线上mongo 链接不上
const mogoUrl = `mongodb://47.77.93.97:27017/node-api`
const connect = () => {
  console.log()
  mongoose
    .connect(mogoUrl, {
      useNewUrlParser: true
    })
    .then(() => {
      console.log('数据库连接成功')
    })
    .catch((err) => {
      console.log('数据库连接失败', err)
    })
}

module.exports = connect
