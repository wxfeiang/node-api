const Joi = require('joi')

exports.validata = function (err, req, res, next) {
  // 验证失败导致的错误
  if (err instanceof Joi.ValidationError) return res.cc(err)

  if (err.name == 'UnauthorizedError') return res.cc(err, 'token失效/认证出错')

  res.cc(err)
}
