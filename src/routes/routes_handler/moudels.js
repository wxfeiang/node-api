/**
 * @group 使用案例注释
 * @summary 注释 不需要很多参数
 * @route GET /api/users/exp
 * @param {string} username.query.required - 用户id  路径拼接方式
 * @param {string} id.query.required - 用户id  路径拼接方式
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @returns {Response.model} 200 - 返回参数
 */

/**
 * @group 使用案例注释
 * @route GET /api/users/exp/{id}
 * @summary 列表更新
 * @param {string} id.path.required - 用户id  路径拼接方式
 * @returns {object} 200
 * @returns {Array.<UpdateList>} UpdateList
 * @security JWT
 */

/**
 * @route PUT /updateList22/:id
 * @summary 列表更新
 * @param {UpdateList.model} point.body.required - 用户名
 * @param {string} id.path.required - 用户id
 * @group 使用案例注释
 * @returns {object} 200
 * @returns {Array.<UpdateList>} UpdateList
 * @security JWT
 */

/**
 * 测试 配置文件上传接口2
 * @group 使用案例注释
 * @route POST /api/users/multer_exple
 * @summary 配置文件上传接口
 * @param {file}  aaa.formData.required - 请输入用户名
 * @produces application/json application/xml
 * @consumes multipart/form-data
 * @returns {Response.model} 200 - 返回参数
 * @security JWT
 */
// 不支持同时上传多个文件。。。。 可以在apifox postman 测试

/**
 * @typedef Response  - 返回模型
 * @property {[integer]} code.required - 状态码 - eg: 200
 * @property {string} message.required - 提示信息 - eg: 成功
 * @property {object} data - 返回数据 - eg: object{}
 */

/**
 * @typedef TestPost   - body 参数提交模型
 * @property {string} Test_name.required - 用户名 - eg: admin
 * @property {string} Test_password.required - 密码 - eg: 1234566789
 * @property {string} Test_email.required - 邮箱 - eg: 234566789@qq.com
 */

/**
 * @typedef TestGet   - get 参数提交模型
 * @property {string} Test_name.required - 用户名 - eg: admin
 * @property {string} Test_password.required - 密码 - eg: 1234566789
 * @property {string} Test_email.required - 邮箱 - eg: 234566789@qq.com
 */

/**
 * @typedef UpdateList
 * @property {string} username.required - 用户名 - eg: admin
 */

/**
 * @typedef SearchPage
 * @property {integer} page.required - 第几页 - eg: 1
 * @property {integer} size.required - 数据量（条）- eg: 5
 */
/**
 * @typedef serchdata
 * @property {string} serchdata.required - 关键字 - eg: 黑丝
 */

/**
 * @route PUT /api/acjson/put/:id
 * @summary  put 真确结构写法 详情
 * @group 使用案例注释
 * @param {string} id.path.required - 用户id  put
 * @returns {Response.model} 200
 */

/**
 * @route DELETE /api/acjson/delete/:id
 * @summary delete 详情
 * @group 使用案例注释
 * @param {string} id.path.required - 用户id  路径拼接方式
 * @returns {Response.model} 200
 */
/**
 *  get 接收参数的方式------
 *  测试    添加测试文件
 * query   ? id ="sss"
 *  -----
 * params   '/text/:id/:ff'
 */
