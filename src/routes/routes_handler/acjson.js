const superagent = require('superagent')
const cheerio = require('cheerio')

const url = `https://ncov.dxy.cn/ncovh5/view/pneumonia`

const path = require('path') //系统路径模块
const fs = require('fs') //文件模块

const log4js = require('../../config/logConfig')
const { response } = require('express')

const logoth = log4js.getLogger('oth')

const baseUrl = 'https://youh15.xyz'

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
/**
 * @route GET /api/acjson/outheMenu
 * @summary outheMenu 目录
 * @group 获取数据资料
 * @returns {Response.model} 200
 */
exports.outheMenu = (req, res) => {
  superagent
    .get(baseUrl)
    .then((response) => {
      const $ = cheerio.load(response.text) // 然后后我们就可以通过jQuery的方法操作dom
      const resAlt = []
      $('.row-item ').each((idx, ele) => {
        if (idx > 1) {
          let data = {
            titele: $(ele).find('.row-item-title  a').text(),
            list: []
          }
          $(ele)
            .find('.row-item-content li')
            .each((i, cel) => {
              let itemList = {
                itemTel: $(ele).find('.row-item-content li').eq(i).find('a').text(),
                itemhref: $(ele).find('.row-item-content li').eq(i).find('a').attr('href') + '/'
              }
              data.list.push(itemList)
            })
          resAlt.push(data)
        }
      })
      res.cc('成功', resAlt)
    })
    .catch((err) => {
      res.cc(err, '没有检索到对应的数据')
    })
}

/**
 * @route GET /api/acjson/outheSerch
 * @summary outheSerch 视频搜索
 * @group 获取数据资料
 * @param {string} serchdata.query.required - 检索关键字
 * @param {number} size.query - 页码
 * @returns {Response.model} 200
 */
exports.outheSerch = (req, res) => {
  const { serchdata, size } = req.query
  let urlOut = size ? '/vedio/' + size : ''

  let url = baseUrl + '/search/' + encodeURI(serchdata) + urlOut
  //  vedio/4
  console.log(url)
  superagent
    .get(url)
    .then((response) => {
      const $ = cheerio.load(response.text) // 然后后我们就可以通过jQuery的方法操作dom
      const resAlt = {
        otutList: [],
        list: [],
        total: $('.page_ul li')
          .last()
          .find('a')
          .text()
          .replace(/[\u4e00-\u9fa5]/g, '')
          .replace(/\s*/g, '')
      }
      //  返回检索的列表数据
      $('.channel-list .clearfix dl').each((idx, ele) => {
        // cherrio中$('selector').each()用来遍历所有匹配到的DOM元素
        // 参数idx是当前遍历的元素的索引，ele就是当前便利的DOM元素
        let data = {
          title: $(ele).find('a').attr('title'), //
          src: $(ele).find('img').attr('src'), //
          id: $(ele).find('a').attr('href'),
          fenshu: $(ele).find('dd').eq(-2).find('h3').text(),
          time: $(ele).find('dd').last().find('h3').text().trim()
        }
        resAlt.list.push(data) // 存入最终结果数组.
      })
      res.cc('成功', resAlt)
    })
    .catch((err) => {
      res.cc(err, '没有检索到对应的数据', err)
    })
}

/**
 * @route GET /api/acjson/outheType
 * @summary 爬取outpcType 图片类型
 * @group 获取数据资料
 * @returns {Response.model} 200
 */
exports.outheType = (req, res) => {
  var type = req.query.type ? req.query.type : ''
  var url = baseUrl + '/list/' + type
  console.log(url)
  superagent
    .get(url)
    .then((response) => {
      const $ = cheerio.load(response.text)
      var resAlt = []
      $('.channel-list .clearfix dl').each((idx, ele) => {
        // cherrio中$('selector').each()用来遍历所有匹配到的DOM元素
        // 参数idx是当前遍历的元素的索引，ele就是当前便利的DOM元素
        let data = {
          title: $(ele).find('a').attr('title'), //
          src: $(ele).find('img').attr('src'), //
          id: $(ele).find('a').attr('href'),
          fenshu: $(ele).find('dd').eq(-2).find('h3').text(),
          time: $(ele).find('dd').last().find('h3').text()
        }
        resAlt.push(data) // 存入最终结果数组.
      })
      res.cc('成功', resAlt)
    })
    .catch((err) => {
      resesd.cc(err, '当前分页没有对应的数据', err)
    })
}

/**
 * @route GET /api/acjson/outheData
 * @summary 爬取outheData 图片列表
 * @group 获取数据资料
 * @param {string} typeId.query.required - 当前分页类型链接
 * @param {string} size.query - 当前分页  路径拼接方式
 * @returns {Response.model} 200
 */
exports.outheData = (req, res) => {
  const { typeId, size } = req.query
  let cursize = size ? size : 1

  var url = baseUrl + typeId + cursize
  console.log(url)
  superagent
    .get(url)
    .then((response) => {
      const $ = cheerio.load(response.text)
      const resAlt = {
        list: [],
        total: $('.page_ul li')
          .last()
          .find('a')
          .text()
          .replace(/[\u4e00-\u9fa5]/g, '')
          .replace(/\s*/g, '')
      }
      $('.channel-list .clearfix dl').each((idx, ele) => {
        let data = {
          title: $(ele).find('a').attr('title'), //
          src: $(ele).find('img').attr('src'), //
          id: $(ele).find('a').attr('href'),
          fenshu: $(ele).find('dd').eq(-2).find('h3').text(),
          time: $(ele).find('dd').last().find('h3').text().trim()
        }
        resAlt.list.push(data) // 存入最终结果数组.
      })

      res.cc('成功', resAlt)
    })
    .catch((err) => {
      res.cc(err, '当前分页没有对应的数据', err)
    })
}

/**
 * @route GET /api/acjson/outheDetl
 * @summary 爬取outheDetl 详情
 * @group 获取数据资料
 * @param {string} id.query.required - 用户id  路径拼接方式
 * @returns {Response.model} 200
 */
exports.outheDetl = (req, res) => {
  let url = baseUrl + req.query.id
  superagent
    .get(url)
    .then((response) => {
      const $ = cheerio.load(response.text) // 然后后我们就可以通过jQuery的方法操作dom
      let resAlt = {
        title: $('.main > h1').text(),
        list: []
      }

      $('.main .content img').each((idx, ele) => {
        let imgsrc = $('.main .content img').eq(idx).attr('src')
        resAlt.list.push(imgsrc)
      })
      // TODO详情可能是视频

      res.cc('成功', resAlt)
    })
    .catch((err) => {
      res.cc(err, '当前ID没有对应的数据', err)
    })
}

/**
 * @route GET /api/acjson/weibo
 * @summary 爬取weibo 图片详情
 * @group 获取数据资料
 * @returns {Response.model} 200
 */
exports.weibo = (req, res) => {
  let url = 'https://www.hhlusp.cc/'
  superagent
    .get(url)
    .then((response) => {
      const $ = cheerio.load(response.text)

      res.cc('成功', response.text)
    })
    .catch((err) => {
      res.cc(err, '当前ID没有对应的数据', err)
    })
}
