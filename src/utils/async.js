const asyncHander = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
module.exports = asyncHander

//  中间件 的使用

//  共享  res,req

// 必须有  next()

// 完整的 （req,res,next) =>{ .....  next()}

// 导出后 引用    app.use(使用)
