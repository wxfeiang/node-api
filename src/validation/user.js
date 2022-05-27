// 导入 Joi 来定义验证规则
const Joi = require('joi')
// 1. 导入 @escook/express-joi
//const expressJoi = require('@escook/express-joi')

// 定义用户名和密码 验证
const username = Joi.string().alphanum().min(3).max(12).required()
const password = Joi.string()
  .pattern(/^[\S]{6,50}$/)
  .required()
const epassword = Joi.ref('password')

//  定义输出的 规则对象

exports.reg_login = {
  body: {
    username,
    password,
    epassword
  }
}
exports.reg_mockogin = {
  body: {
    username,
    password
  }
}

// 定义用户名和密码 验证
const user_name = Joi.string().alphanum().min(2).max(4).required()
const user_sex = Joi.string().required()
const user_card = Joi.required()

exports.reg_jkgsuser = {
  body: {
    user_name,
    user_sex,
    user_card
  }
}

/**

 Joi.string()/Joi.number()：定义只能是字符串/数字类型
 Joi.alphanum()：只能是字母字符串或者数字字符串
 Joi.min()/max()：限制字符串最大最小长度
 Joi.required()：此属性必填
 Joi.error()：自定义错误信息(new Error('提示信息'))
 Joi.regex()：接收一个字符串规则验证
 [Joi.string(), Joi.number()]：可以时字符串也可以是数字类型
 Joi.integer()：必须是整数

// 定义
const schema = {
    username: Joi.string().alphanum().min(3).max(30).required().error(new       
    Error(‘自定义错误信息’)),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    access_token: [Joi.string(), Joi.number()],
    birthyear: Joi.number().integer().min(1900).max(2013),
    email: Joi.string().email()
};
验证
Joi.validate({ username: 'abc', birthyear: 1994 }, schema);
//或者
schema.validateAsync({ username: 'abc', birthyear: 1994 },规则)
**/
