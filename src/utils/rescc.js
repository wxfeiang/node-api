const log4js = require('../config/logConfig')
const errlogger = log4js.getLogger('err')
exports.resData = (req, res, next) => {
  // status  1  失败   err  描述
  res.cc = function (err, data = null) {
    let sendData = {
      code: err === '成功' ? 200 : 500,
      message: err instanceof Error ? err.message : err,
      data
    }
    let quer = req.body || req.query || req.param0
    if (sendData.code !== 200) {
      errlogger.error(req.url, req.method, '查询参数：==>', quer, '<===||====>', '错误返回信息==>', sendData) //
    }
    res.send(sendData)
  }
  next()
}

//  错误 只传  err
