const express = require('express')
const router = express.Router()

const path = require('path') //系统路径模块
const fs = require('fs') //文件模块
const multiparty = require('multiparty') //  文件上传插件

// 请求 layui moke table data
router.get('/layui', (req, res) => {
  var file = path.join(__dirname, 'json/laui.json')
  fs.readFile(file, 'utf-8', function (err, data) {
    if (err) {
      res.send('文件读取失败')
    } else {
      res.send(data)
    }
  })
})
//  整个文件
router.get('/layuijson', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'json/index.html'))
})
// 请求html    文件
router.get('/email', (req, res) => {
  exists = fs.existsSync(__dirname + 'email.html')
  if (!exists) {
    fs.mkdirSync(__dirname + 'email.html')
    console.log('没有文件写进去了')
  }
  console.log('有这个文件')

  /**
  var status = fs.existsSync(`${__dirname}/upload`)
  if (!status) {
    // 创建文件
    fs.mkdir(`${__dirname}/upload`, (error) => {
      if (error) throw error
      console.log('目录创建成功。')
    })
  } else {
    console.log('文件夹已经存在')
  }
  //  拿到上传的文件数据

  //  写入服务器文件夹
 */
})
//  上传文件

router.post('/upload', (req, res) => {
  //  fs.exists(path,callback)   检测文件夹是否存在
  //  注意文件路径 console.log(__dirname)
  // const upload = multer({ dest: './upload/' }) //  存放文件的地方
})

router.post('/uploads', (req, res, next) => {
  var form = new multiparty.Form()
  form.parse(req, (err, fields, files) => {
    //  console.log(files) // 上传的文件信息
    if (err) throw err
    var file = files.name[0]
    console.log(file)

    var rs = fs.createReadStream(file.path)
    var newPath = file.originalname
    var ws = fs.createWriteStream('./upload' + newPath)
    rs.pipe(ws)
    ws.on('close', (error) => {
      res.send(newPath)
    })
  })
})

module.exports = router
/**
 *
 * query   ? id ="sss"
 *
 * params   '/text/:id/:ff'
 */
