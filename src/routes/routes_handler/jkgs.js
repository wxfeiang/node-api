const mysqldb = require('../../utils/mysqldb') // 数据库
const asyncHander = require('../../utils/async')
/**
 * @typedef jkgsAdduser
 * @property {string} user_name.required - name - eg: admin
 * @property {number} user_sex.required - sex - eg: 1
 * @property {string} user_card.required - acrd - eg: 122424188111243456
 */

/**
 * @group jkgsmsg
 * @summary 注册用户信息
 * @route POST /api/jkgs/jkgsAdduser
 * @param {jkgsAdduser.model} point.body.required - the new point
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @returns {Response.model} 200
 * @headers {integer} 200.X-Rate-Limit
 * @headers {string} 200.X-Expires-After
 */

exports.jkgsAdduser = asyncHander((req, res) => {
  const { user_name, user_sex, user_card } = req.body
  const sql = `INSERT INTO users_jkgs (user_name, user_sex, user_card) VALUES (? ,? ,? )`
  const parm = [user_name, user_sex, user_card]
  mysqldb.query(sql, parm, function (results, fields) {
    res.cc(results)
  })
})

/**
 * @group jkgsmsg
 * @summary  根据用户名查询用户信息
 * @route GET /api/jkgs/jkgsquerUser
 * @param {string} username.query.required - 用户id  路径拼接方式
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @returns {Response.model} 200 - 返回参数
 * @security JWT
 */

exports.jkgsquerUser = asyncHander((req, res) => {
  const { user_name } = req.query
  const sql = `SELECT  * FROM  users_jkgs WHERE user_name =? `
  const parm = [user_name]
  mysqldb.query(sql, parm, function (results, fields) {
    res.cc('查询成功', results)
  })
})
