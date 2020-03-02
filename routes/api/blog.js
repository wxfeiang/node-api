const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Blog = require("../../models/Blog");
const validateBlogInput = require("../../validation/blog");
// $route  GET api/blog/test
// @desc   返回的请求的json数据
// @access public
router.get("/test", (req, res) => {
    res.json({ msg: "blog works" });
});
// $route  GET api/profile/blog
// @desc   返回的请求的json数据  获取当前登录得用户个人信心
// @access public
router.post("/blog", (req, res) => {
    //console.log(req.body);
    const { errors, isValid } = validateBlogInput(req.body);

    // 判断isValid是否通过
    // if (!isValid) {
    //     return res.status(400).json(errors);
    // }
    const newBlog = new Blog({
        author: req.body.author,
        content: req.body.content,
        title: req.body.title,
        catrgories: req.body.catrgories.split(",")
    });

    newBlog.save().then(blog => res.json(blog));
});
router.post("/levmsg", (req, res) => {
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
    if (req.body.author) levmsgs.author = req.body.author;
    if (req.body.content) levmsgs.content = req.body.content;
    if (req.body.title) levmsgs.title = req.body.title;
    if (req.body.userIP) levmsgs.userIP = req.body.userIP;
    if (req.body.text) levmsgs.text = req.body.text;


    new Blog(levmsgs)
        .save()
        .then(() => {
            Blog.find()
                .sort({ date: -1 })
                .limit(5)
                .then(blog => res.json(blog))
                .catch(err => res.status(404).json({ nopostsfound: "找不到任何评论信息" }));

        })

});
//  获取所有的 个人简历信息  给前端
router.get("/levmsg", (req, res) => {
    //console.log(req.body);
    Blog.find()
        .sort({ date: -1 })
        .limit(5)
        .then(blog => res.json(blog))
        .catch(err => res.status(404).json({ nopostsfound: "找不到任何评论信息" }));
    //  按时间排序
});



module.exports = router;