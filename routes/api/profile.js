const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
// 表
const Profile = require("../../models/Profiles");
const User = require("../../models/User");

const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

// $route  GET api/profile/test
// @desc   返回的请求的json数据
// @access public
router.get("/test", (req, res) => {
  res.json({
    msg: "profiles  loworking "
  });
});
// $route  GET api/profile
// @desc   返回的请求的json数据  获取当前登录得用户个人信心
// @access public
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    //查询数据库
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatart"]) // 关联表 获取
      .then(profile => {
        if (!profile) {
          errors.noprofile = "该用户的信息不存在~!";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);
// $route post api/profile/private
// @desc   返回的请求的json数据  获取当前登录得用户个人信心
// @access public
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // 判断isValid是否通过
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const profileFields = {};
    // 获取前端传递得数据
    profileFields.user = req.user.id; // 登录成功 获取
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    // skills - 数组转换
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    profileFields.social = {};
    if (req.body.wechat) profileFields.social.wechat = req.body.wechat;
    if (req.body.QQ) profileFields.social.QQ = req.body.QQ;
    if (req.body.tengxunkt) profileFields.social.tengxunkt = req.body.tengxunkt;
    if (req.body.wangyikt) profileFields.social.wangyikt = req.body.wangyikt;
    // 查询数据库
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          //用户信息存在  执行更新方法

          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          ).then(profile => res.json(profile));
        } else {
          // 用户信息不存在 执行创建方法
          Profile.findOne({ handle: profileFields.handle }).then(profile => {
            if (profile) {
              errors.handle = "该用户的handle个人信息已经存在,请勿重新创建!";
              res.status(400).json(errors);
            }
            new Profile(profileFields)
              .save()
              .then(profile => res.json(profile));
          });
        }
      })
      .catch(err => res.status(404).json(err));
  }
);
// $route  GET api/profile/handle/:handle
// @desc   通过handle获取个人信息
// @access public
router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatart"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "未找到该用户信息";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});
// $route  GET api/profile/user/:user_id
// @desc   通过user_id获取个人信息
// @access public
//   populate  在从关联的表中获取字段 和当钱的字段一起返回 
router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatart"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "未找到该用户信息";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});
// $route  GET api/profile/all
// @desc   获取所有人的信息
// @access public
router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatart"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "没有任何用户信息";
        res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err => res.status(404).json(err));
});

// $route  POST api/profile/experience
// @desc   添加个人经历
// @access Private  登录以后才会有 根据ID
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    // 判断isValid是否通过
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      profile.experience.unshift(newExp); //  添加到经历对象
      //存
      profile.save().then(profile => res.json(profile));
    });
  }
);
// $route  POST api/profile/education
// @desc   添加个人学历
// @access Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    // 判断isValid是否通过
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      profile.education.unshift(newEdu);

      profile.save().then(profile => res.json(profile));
    });
  }
);
// $route  DELETE api/profile/experience/:epx_id
// @desc   删除个人经历
// @access Private
router.delete(
  "/experience/:epx_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.epx_id);
        // 找到下标

        profile.experience.splice(removeIndex, 1);

        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);
// $route  DELETE api/profile/education/:edu_id
// @desc   删除个人学历
// @access Private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.epx_id);

        profile.education.splice(removeIndex, 1);

        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);
// $route  DELETE api/profile
// @desc   删除整个用户
// @access Private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() => {
        res.json({ success: true });
      });
    });
  }
);
// 公出
module.exports = router;
