const log4js = require('../config/logConfig')
const errlogger = log4js.getLogger('err')
exports.resData = (req, res, next) => {
  res.cc = function (err, data = null) {
    let resAll = null
    if (err instanceof Error) {
      // 本来就出错了
      resAll = {
        code: err.status || 500,
        message: err && data ? data : err.message
      }
    } else if (err <= 500 || err >= 400) {
      // 自定义出错
      resAll = {
        code: err,
        message: '失败',
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
