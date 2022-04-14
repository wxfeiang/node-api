exports.resData = (req, res, next) => {
  // status  1  失败   err  描述
  res.cc = function (err, data = null, code = 500) {
    res.send({
      code: arguments[1] ? 200 : 500,
      message: err instanceof Error ? err.message : err,
      data
    })
  }
  next()
}

//  错误 只传  err
