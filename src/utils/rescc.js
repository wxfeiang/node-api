const log4js = require('../config/logConfig')
const errlogger = log4js.getLogger('err')
exports.resData = (req, res, next) => {
  res.cc = (error, data = null) => {
    let resAll = null
    if (error instanceof Error) {
      // 本来就出错了
      resAll = {
        code: error.status || 500,
        message: error && data ? data : chagneError(error)
      }
    } else if (error < 600 && error >= 400) {
      // 自定义出错
      resAll = {
        code: error,
        message: typeof data === 'object' ? data : '操作失败',
        data
      }
    } else {
      resAll = {
        code: 200,
        message: typeof data !== 'object' ? data : '操作成功',
        data: error //  只传入了一个结果
      }
    }

    let quer = req.body || req.query || req.params
    if (resAll.code !== 200) {
      errlogger.error('api:' + req.url, 'types' + req.method, '查询参数：==>', quer, '错误返回信息==>', resAll) //
    }
    res.send(resAll)
  }
  next()
}

function chagneError(error) {
  switch (error.status) {
    case 400:
      error.message = '错误请求'
      break
    case 401:
      error.message = '未授权,请重新登录,Token 认证失败'
      break
    case 403:
      error.message = '拒绝访问'
      break
    case 404:
      error.message = '请求错误,未找到该资源'
      break
    case 405:
      error.message = '请求方法未允许'
      break
    case 408:
      error.message = '请求超时'
      break
    case 500:
      error.message = '服务器端出错'
      break
    case 501:
      error.message = '网络未实现'
      break
    case 502:
      error.message = '网络错误'
      break
    case 503:
      error.message = '服务不可用'
      break
    case 504:
      error.message = '网络超时'
      break
    case 505:
      error.message = 'http版本不支持该请求'
      break
    default:
      error.message
  }
  return error.message
}
