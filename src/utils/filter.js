const path = require('path')
// 验证文件类型
exports.checkFileType = function (file, cb) {
  if (file) return cb('请选择上传文件！！！！')
  // 允许的文件扩展名格式
  const filetypes = /jpeg|jpg|png|gif/
  // 验证扩展名
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  // 验证MIME
  const mimetype = filetypes.test(file.mimetype)
  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb('上传的格式有误，请检查！')
  }
}

/**
 * 判断是否为空
 */

exports.isNull = (data) => {
  if (!data) return true
  if (JSON.stringify(data) === '{}') return true
  if (JSON.stringify(data) === '[]') return true
}
