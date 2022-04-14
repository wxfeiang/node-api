// 在node端要有一个帮助我请求丁香园网站
const superagent = require('superagent')
const cheerio = require('cheerio')

// superagent.get(url).then()
// 1. 请求目标网站
const url = `https://ncov.dxy.cn/ncovh5/view/pneumonia`

const path = require('path') //系统路径模块
const fs = require('fs') //文件模块

/**
 * @swagger
 * /api/acjson/layui:
 *   get:
 *     tags:
 *       - acjson
 *     description: 请求layui表格模拟数据
 *     responses:
 *       200:
 *         description: 请求成功
 */

exports.layui = (req, res) => {
  var file = path.join(__dirname, 'json/laui.json')
  fs.readFile(file, 'utf-8', function (err, data) {
    if (err) {
      res.send('文件读取失败')
    } else {
      res.send(data)
    }
  })
}
/**
 * @swagger
 * /api/acjson/email:
 *   get:
 *     tags:
 *       - acjson
 *     description: 请求email 文件
 *     responses:
 *       200:
 *         description: 请求成功
 */
exports.email = (req, res) => {
  exists = fs.existsSync(__dirname + 'email.html')
  if (!exists) {
    fs.mkdirSync(__dirname + 'email.html')
    console.log('__dirname', __dirname)
    res.send('没有文件写进去了')
  }
  res.send('.....', __dirname)
}
//  爬去网页数据
/**
 * @swagger
 * /api/acjson/chinaData:
 *   get:
 *     tags:
 *       - acjson
 *     description: 爬取网页数据
 *     responses:
 *       200:
 *         description: 请求成功
 */
exports.chinaData = (req, resesd) => {
  superagent
    .get(url)
    .then((res) => {
      // console.log(res.text) // 相应的内容
      // 浏览器可以解析html 但是node端不行
      // 2. 去解析html字符串从里面提取对应疫情数据
      const $ = cheerio.load(res.text) // 然后后我们就可以通过jQuery的方法操作dom
      // 获取全国疫情信息数据
      var $getListByCountryTypeService1 = $('#getListByCountryTypeService1').html()
      var $getAreaStat = $('#getAreaStat').html()
      var $getStatisticsService = $('#getStatisticsService').html()
      // console.log($getListByCountryTypeService1)
      // 使用字符切割 正则匹配 eval函数
      var dataObj = {}
      eval($getListByCountryTypeService1.replace(/window/g, 'dataObj'))
      eval($getAreaStat.replace(/window/g, 'dataObj'))
      eval($getStatisticsService.replace(/window/g, 'dataObj'))
      // console.log(dataObj)
      // 3. fs写入数据到本地
      // fs.writeFile(path.join(__dirname, './data.json'), JSON.stringify(dataObj), err => {
      //     if (err) throw err
      //     console.log('数据写入成功')
      // })
      // console.log()
      resesd.send(dataObj) //  这里注意 res 参数
    })
    .catch((err) => {
      throw err
    })
}
