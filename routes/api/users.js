//用于登录注册 接口
const express = require("express");
const router = express.Router();
const User = require("../../models/User");
//const bcrypt = require("bcrypt");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// $route  GET api/users/test
// @desc   返回的请求的json数据
// @access public
router.get("/test", (req, res) => {
    res.json({
        msg: "loworking "
    });
});
// $route  post api/users/test
// @desc   返回的请求的json数据
// @access public   注册接口
router.post("/register", (req, res) => {
    // console.log(req.body)
    // 查询数据库
    const {
        errors,
        isValid
    } = validateRegisterInput(req.body); // 解构
    // 判断是否通过
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({
        email: req.body.email
    }).then(user => {
        if (user) {
            return res.status(400).json({
                email: "邮箱已经被注册!!!"
            });
        } else {
            // 头像地址
            const avatar = gravatar.url(req.body.email, {
                s: "200",
                r: "pg",
                d: "mm"
            });
            //存
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                identity: req.body.identity,
                avatar //  es6一样只写一个

            });
            //  密码加密
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    // 保存
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});
// $route  post api/users/login
// @desc   jwt tocan
// @access public 登录接口
router.post("/login", (req, res) => {
    const {
        errors,
        isValid
    } = validateLoginInput(req.body); // 解构
    // 判断isValid是否通过
    if (!isValid) {
        return res.status(400).json(errors);
    }
    // 获取到
    const email = req.body.email;
    const password = req.body.password;
    // 查询是否存在
    User.findOne({
        email
    }).then(user => {
        if (!user) {
            return res.status(400).json({
                email: "邮箱不存在!!!"
            });
        }
        // 密码匹配
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                const rule = {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                    identity: user.identity
                };
                //res.json({ msg: "sucess" })
                // jwt.sign("规则","加密名字","tocken 过期时间","cb")

                jwt.sign(
                    rule,
                    keys.secretOrKey, {
                        expiresIn: 3600
                    },
                    (err, token) => {
                        if (err) throw err;
                        res.json({
                            success: true,
                            // token: "mrw" + token
                            token: "Bearer " + token //  固定格式
                        });
                    }
                );
            } else {
                return res.status(400).json({
                    password: "密码错误!!!"
                });
            }
        });
    });
});

// $route  get api/users/current
// @desc
// @access public   请求当前信息
//  验证token
router.get(
    "/current",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        // res.json(req.user)
        // res.json({ msg: "sucess" })
        res.json({
            //  之前pssport.js 上返回
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            identity: req.user.identity,
            avatar: req.user.avatar

        });
    }
);

module.exports = router;