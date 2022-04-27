// 导入 Joi 来定义验证规则
const Joi = require('joi')
// 定义用户名和密码 验证
const user_name = Joi.string().min(2).max(4).required()
const user_sex = Joi.string().required()
const user_card = Joi.string().required()

exports.reg_jkgsuser = {
  body: {
    user_name,
    user_sex,
    user_card
  }
}

// 检测查询用户

exports.reg_jkgsquerUser = {
  query: {
    user_name
  }
}
