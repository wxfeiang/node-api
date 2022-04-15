// 导入 Joi 来定义验证规则
const Joi = require('joi')
// 1. 导入 @escook/express-joi
//const expressJoi = require('@escook/express-joi')

// 定义用户名和密码 验证

const username = Joi.string().alphanum().min(3).max(12).required()
const password = Joi.string()
  .pattern(/^[\S]{6,15}$/)
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

/**
string() 000474#
alphanum ) ARM222 a-zA-ZO-9 00 7 4 4
min(length) A KE
max (length) #X*E
required() aIR, Til undefined
pattern (ID#dE) DRAIN*SEA AO

**/
