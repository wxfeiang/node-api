//  所有的工具类

const os = require('os')
//获取本机ip
exports.getIpAddress = () => {
  /**os.networkInterfaces() 返回一个对象，该对象包含已分配了网络地址的网络接口 */
  //   var interfaces = os.networkInterfaces()
  //   for (var devName in interfaces) {
  //     var iface = interfaces[devName]
  //     for (var i = 0; i < iface.length; i++) {
  //       var alias = iface[i]
  //       if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
  //         return alias.address
  //       }
  //     }
  //   }
  const os = require('os')
  const ifaces = os.networkInterfaces()
  let en0

  Object.keys(ifaces).forEach((ifname) => {
    let alias = 0

    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        en0 = iface.address
        console.log(ifname + ':' + alias, iface.address)
      } else {
        // this interface has only one ipv4 adress
        console.log(ifname, iface.address)
        en0 = iface.address
      }
      ++alias
    })
  })
  return en0
}
