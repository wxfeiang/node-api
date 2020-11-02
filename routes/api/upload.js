const express = require('express')
const router = express.Router()

const path = require('path') //系统路径模块
const fs = require('fs') //文件模块
const multiparty = require('multiparty') //  文件上传插件
var request = require('request')

//  引入百度AI 在线语音合成
const AipSpeechClient = require('baidu-aip-sdk').speech
// 设置APPID/AK/SK
const APP_ID = '20322593'
const API_KEY = '12oatmwX5ZkPsQgcud2TrGzN'
const SECRET_KEY = 'lKXMWg9YPgqSD4BhGHZ1f40saaVI6E4B'
const client = new AipSpeechClient(APP_ID, API_KEY, SECRET_KEY)

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
    //  传入的文件列表
    // console.log('文件列表')
    // console.log(files)
    if (err) {
      res.send('上传文件失败')
    } else {
      var file = files.file[0]
      var status = beforeAvatarUpload(file)
      console.log(status)
      if (status.code != 400) {
        var rs = fs.createReadStream(file.path)
        var newPath = getType(file.originalFilename)
        //  可能不会自动创建目录
        // const path = './public/upload/'

        // if (!fs.existsSync(path)) {
        //   console.log('wemjiam,i;i')
        //   fs.mkdirSync(path)
        // }
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
        console.log('esle 400-----------')
        status.code = 200
        res.send(status)
      }
    }
  })
})

// 判断文件大小  类型      重命名文件

function beforeAvatarUpload(file) {
  var err = {}
  const isJPG = file.headers['content-type'] === 'image/jpeg'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    err = {
      code: 400,
      msg: '上传头像图片只能是 JPG 格式!',
    }
  }
  if (!isLt2M) {
    err = {
      code: 400,
      msg: '上传头像图片大小不能超过 2MB!',
    }
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
//  百度文字转语音
router.post('/textAuto', (req, res, next) => {
  var text = req.body.text
  client.text2audio(text).then(
    (result) => {
      if (result.data) {
        var newPath = new Date().getTime() + '.mp3'
        fs.writeFileSync(`./public/audio/${newPath}`, result.data)
        //  此文件路径还要存到数据库
        var data = {
          code: 200,
          msg: '语音合成成功',
          path: 'audio/' + newPath,
        }
        res.send(data)
      } else {
        // 服务发生错误
        res.send(result)
      }
    },
    (e) => {
      // 发生网络错误
      res.send(e)
    }
  )
})

module.exports = router
/**
 *  测试  添加测试文件
 * query   ? id ="sss"
 *
 * params   '/text/:id/:ff'
 */
