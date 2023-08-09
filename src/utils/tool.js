/*
 * @Author: wxfeiang
 * @Description: 所有的工具类
 * @Date: 2022-10-08 15:19:18
 * @LastEditTime: 2022-10-08 15:49:41
 * @FilePath: /node-api/src/utils/tool.js
 */

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
/**
 * @description: 获取URL的参数
 * @return {*}
 */

exports.getParams = (key) => {
  var result = {} // 定义一个全局的对象
  var str = window.location.search
  if (str.startsWith('?')) {
    // 判断str以？开头的
    var strParams = str.split('?')[1]
    var arrParams = strParams.split('&')
    //然后进行for循环，这里直接用了forEach
    arrParams.forEach((item) => {
      var temKey = item.split('=')[0]
      var temVal = item.split('=')[1]
      result[temKey] = temVal
    })
  }
  return result[key]
}
