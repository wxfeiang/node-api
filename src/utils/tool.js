//  所有的工具类

const os = require('os')
//获取本机ip
exports.getIpAddress = () => {
  /**os.networkInterfaces() 返回一个对象，该对象包含已分配了网络地址的网络接口 */
  var interfaces = os.networkInterfaces()
  for (var devName in interfaces) {
    var iface = interfaces[devName]
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i]
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address
      }
    }
  }
}
