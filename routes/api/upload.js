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
router.post('/upload', (req, res, next) => {
  var form = new multiparty.Form()
  form.parse(req, (err, fields, files) => {
    console.log(files.name[0])

    if (err) {
      res.send('上传文件失败')
    } else {
      var file = files.name[0]
      //  获取带有拼接符号的  key
      // console.log(file.headers['content-type'])
      var status = beforeAvatarUpload(file)
      console.log(status)
      if (JSON.stringify(status) == '{}') {
        var rs = fs.createReadStream(file.path)
        var newPath = getType(file.originalFilename)
        var ws = fs.createWriteStream('./public/upload/' + newPath)
        rs.pipe(ws)
        ws.on('close', () => {
          //  此文件路径还要存到数据库
          var data = {
            code: 200,
            msg: '上传成功',
            path: 'upload/' + newPath,
          }
          res.send(data)
        })
      } else {
        status.code = 200
        res.send(status)
      }
    }
  })
})
//  带有token  的请求 图片上传
router.post('/uploadTok', (req, res, next) => {
  var form = new multiparty.Form()
  form.parse(req, (err, fields, files) => {
    console.log(files.name[0])

    if (err) {
      res.send('上传文件失败')
    } else {
      var file = files.name[0]
      var rs = fs.createReadStream(file.path)

      var newPath = file.originalFilename
      var ws = fs.createWriteStream('./public/upload/' + newPath)
      rs.pipe(ws)
      ws.on('close', () => {
        //  此文件路径还要存到数据库
        res.send('upload/' + newPath)
      })
    }
  })
})
// 判断文件大小  类型      重命名文件

function beforeAvatarUpload(file) {
  var err = {}
  const isJPG = file.headers['content-type'] === 'image/jpeg'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    err.msg = '上传头像图片只能是 JPG 格式!'
  }
  if (!isLt2M) {
    err.msg = '上传头像图片大小不能超过 2MB!'
  }
  return err
}
//获取文件后缀
function getType(file) {
  var filename = file
  var index1 = filename.lastIndexOf('.')
  var index2 = filename.length
  var type = filename.substring(index1, index2)
  //  重命名文件命
  return new Date().getTime() + type
}

module.exports = router
/**
 *
 * query   ? id ="sss"
 *
 * params   '/text/:id/:ff'
 */
