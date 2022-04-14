const Blog = require('../../models/Blog')
const validateBlogInput = require('../../validation/blog')

/**,
 * @swagger
 * /api/blog/addblog:   #路由地址
 *    post:
 *      tags:
 *      - blog
 *      summary: 添加 博客
 *      description: 添加博客内容
 *      consumes:
 *      - "application/json"    #接口接收参数方式
 *      requestBody:    #编写参数接收体
 *          required: true  #是否必传
 *          content:
 *              application/json:
 *                  schema:   #参数
 *                      type: object    #参数类型
 *                      properties:
 *                          author:
 *                                  type: string    #参数类型
 *                                  description: 用户名     #参数描述
 *                          content:
 *                                  type: string    #参数类型
 *                                  description: 性别     #参数描述
 *                          title:
 *                                  type: string    #参数类型
 *                                  description:   标题
 *                          catrgories:
 *                                  type: string    #参数类型
 *                                  description:
 *                  example:        #请求参数样例。
 *                      author: "string"
 *                      content: "string"
 *                      title: "string"
 *                      catrgories: "string"
 *
 *      responses:  #编写返回体
 *        200:     #返回code码
 *          description:  提交成功     #返回code码描述
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          code:   #返回的code码
 *                              type: string
 *                              description: 返回code码
 *                          msg:    #返回体信息。***注意写的位置一定要和res_code对齐。
 *                               type: string   #返回体信息类型
 *                               description: 返回信息
 *                          data:
 *                                type: object
 *                                description: 返回数据
 *        -1:
 *          description: 注册失败
 *      security:
 *      - petstore_auth:
 *        - "write:pets"
 *        - "read:pets"
 *
 * */

exports.addblog = (req, res) => {
  //console.log(req.body);
  const { errors, isValid } = validateBlogInput(req.body)

  // 判断isValid是否通过
  // if (!isValid) {
  //     return res.status(400).json(errors);
  // }
  const newBlog = new Blog({
    author: req.body.author,
    content: req.body.content,
    title: req.body.title,
    catrgories: req.body.catrgories.split(',')
  })

  newBlog.save().then((blog) => res.json(blog))
}
/**,
 * @swagger
 * /api/blog/levmsg:   #路由地址
 *    post:
 *      tags:
 *      - blog
 *      summary:  评论
 *      description:   获取评论数据
 *      consumes:
 *      - "application/json"    #接口接收参数方式
 *      requestBody:    #编写参数接收体
 *          required: true  #是否必传
 *          content:
 *              application/json:
 *                  schema:  #参数
 *                      type: object    #参数类型
 *                      properties:
 *                          author:
 *                                  type: string    #参数类型
 *                                  description: 用户名     #参数描述
 *                          content:
 *                                  type: string    #参数类型
 *                                  description: 性别     #参数描述
 *                          title:
 *                                  type: string    #参数类型
 *                                  description:   标题
 *                          userIP:
 *                                  type: string    #参数类型
 *                                  description:
 *                          text:
 *                                  type: string    #参数类型
 *                                  description:
 *
 *      responses:  #编写返回体
 *        200:     #返回code码
 *          description:  提交成功     #返回code码描述
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          code:   #返回的code码
 *                              type: string
 *                              description: 返回code码
 *                          msg:    #返回体信息。***注意写的位置一定要和res_code对齐。
 *                               type: string   #返回体信息类型
 *                               description: 返回信息
 *                          data:
 *                                type: object
 *                                description: 返回数据
 *        -1:
 *          description: 注册失败
 *      security:
 *      - petstore_auth:
 *        - "write:pets"
 *        - "read:pets"
 *
 * */

exports.addlevmsg = (req, res) => {
  //console.log(req.body);
  // const { errors, isValid } = validateBlogInput(req.body);

  // 判断isValid是否通过
  // if (!isValid) {
  //     return res.status(400).json(errors);
  // }
  // const levmsg = new Blog({
  //     author: req.body.author,
  //     content: req.body.content,
  //     title: req.body.title,
  //     catrgories: req.body.catrgories.split(",")

  // });
  const levmsgs = {}
  if (req.body.author) levmsgs.author = req.body.author
  if (req.body.content) levmsgs.content = req.body.content
  if (req.body.title) levmsgs.title = req.body.title
  if (req.body.userIP) levmsgs.userIP = req.body.userIP
  if (req.body.text) levmsgs.text = req.body.text

  new Blog(levmsgs).save().then(() => {
    Blog.find()
      .sort({ date: -1 })
      .limit(5)
      .then((blog) => res.json(blog))
      .catch((err) => res.status(404).json({ nopostsfound: '找不到任何评论信息' }))
  })
}
/**
 * @swagger
 * /api/blog/getlevmsg:
 *   get:
 *     tags:
 *       - blog
 *     description: 获取所有的 个人简历信息  给前端
 *     responses:
 *       200:
 *         description: 请求成功
 *
 */
exports.getlevmsg = (req, res) => {
  //console.log(req.body);
  Blog.find()
    .sort({ date: -1 })
    .limit(5)
    .then((blog) => res.json(blog))
    .catch((err) => res.status(404).json({ nopostsfound: '找不到任何评论信息' }))
  //  按时间排序
}
