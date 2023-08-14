/*
 * @Author: wxfeiang
 * @Description: 资源
 * @Date: 2022-10-08 15:19:44
 * @LastEditTime: 2022-10-08 15:25:46
 * @FilePath: /node-api/src/routes/api/acjson.js
 */
const express = require('express')
const router = express.Router()
const acjocn = require('../routes_handler/acjson')
// 1. 导入 @escook/express-joi
const expressJoi = require('@escook/express-joi')
const {
  outheSerch,
  outheDetl,
  outheData,
  picData,
  layui,
  outhparams
} = require('../../validation/acjson') // 验证规则
// 请求 layui
router.get('/layui', expressJoi(layui), acjocn.layui)
// 请求html    文件
router.get('/email', acjocn.email)
// 爬取网页数据
router.get('/chinaData', acjocn.chinaData)

router.get('/outheSerch', expressJoi(outheSerch), acjocn.outheSerch)
router.get('/outheType', acjocn.outheType)
router.get('/outheData', expressJoi(outheData), acjocn.outheData)
router.get('/outheDetl', expressJoi(outheDetl), acjocn.outheDetl)

router.get('/outheMenu', acjocn.outheMenu)

router.get('/firdesHref', acjocn.firdesHref)

router.get('/juqing', acjocn.juqing)

router.get('/picData', expressJoi(picData), acjocn.picData)

router.get('/picDataDetl', expressJoi(outheDetl), acjocn.picDataDetl)

router.get('/picDataSerch', expressJoi(outheSerch), acjocn.picDataSerch)

router.put('/put/:id', expressJoi(outhparams), acjocn.put)
router.delete('/delete/:id', expressJoi(outhparams), acjocn.delete)

router.get('/zhairenwu', acjocn.zhairenwu)

router.get('/resourcePool', acjocn.resourcePool)

module.exports = router