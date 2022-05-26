// 导入 Joi 来定义验证规则
const Joi = require('joi')

// 定义用户名和密码 验证
const serchdata = Joi.string().min(1).max(8).required()
const size = Joi.number()
const id = Joi.string().required()
const typeId = Joi.string().required()
const pictype = Joi.string().required()

//  定义输出的 规则对象

exports.outheSerch = {
  query: {
    serchdata,
    size
  }
}
exports.outheData = {
  query: {
    typeId,
    size
  }
}

exports.outheDetl = {
  query: {
    id
  }
}

exports.picData = {
  query: {
    pictype,
    size
  }
}
