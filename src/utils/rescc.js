const log4js = require('../config/logConfig')
const errlogger = log4js.getLogger('err')
exports.resData = (req, res, next) => {
  // status  1  失败   err  描述
  res.cc = function (err, data = null) {
    console.log(err.message, '----erross')
    let resAll = null
    if (err instanceof Error) {
      resAll = {
        code: 500,
        message: err instanceof Error ? err.message : err,
        data
      }
    } else {
      resAll = {
        code: 200,
        message: '查询成功',
        data: arguments[0]
      }
    }

    let quer = req.body || req.query || req.param0
    if (resAll.code !== 200) {
      errlogger.error(req.url, req.method, '查询参数：==>', quer, '<===||====>', '错误返回信息==>', resAll) //
    }
    res.send(resAll)
  }
  next()
}

//  错误 只传  err
