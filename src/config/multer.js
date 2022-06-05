const multer = require('multer')
const path = require('path')
const fs = require('fs') //文件模块
const filter = require('../utils/filter')
// 设置磁盘存储引擎
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const newPath = '../../public/upload'
    // fs.mkdirSync(newPath)
    console.log(fs.existsSync(newPath), '----newPath')
    // TODO  解决文件创建的问题
    //  可能不会自动创建目录
    // const path = './public/upload/'

    // if (!fs.existsSync(newPath)) {
    //   fs.mkdirSync(newPath)
    // }

    cb(null, path.join(__dirname, newPath)) //  注意引用路径
  },
  filename: function (req, file, cb) {
    // 文件重命名
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

// 初始化upload 只上传图片类型的
exports.muUpload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    filter.checkFileType(file, cb)
  },
  limits: { fileSize: 1000000 }
})
//  无限制
exports.unlimited = multer({
  storage,
  limits: { fileSize: 1000000 }
})

// 多文件上传
