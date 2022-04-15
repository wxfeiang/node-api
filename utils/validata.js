const Joi = require('joi')

exports.validata = function (err, req, res, next) {
  // 验证失败导致的错误
  if (err instanceof Joi.ValidationError) return res.cc(err)

  res.cc(err)
}
