//用于登录注册 接口
const express = require("express");
const router = express.Router();

var path = require("path"); //系统路径模块
var fs = require("fs"); //文件模块

// 请求 layui moke table data
router.get("/layui", (req, res) => {
    var file = path.join(__dirname, "json/laui.json");
    fs.readFile(file, "utf-8", function(err, data) {
        if (err) {
            res.send("文件读取失败");
        } else {
            res.send(data);
        }
    });
});

module.exports = router;
