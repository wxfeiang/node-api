//用于登录注册 接口
const express = require('express');
const router = express.Router();

var path = require('path'); //系统路径模块
var fs = require('fs'); //文件模块

// 请求 layui moke table data
router.get('/layui', (req, res) => {
    var file = path.join(__dirname, 'json/laui.json');
    fs.readFile(file, 'utf-8', function(err, data) {
        if (err) {
            res.send('文件读取失败');
        } else {
            res.send(data);
        }
    });
});
// 请求html    文件
router.get('/email', (req, res) => {
    exists = fs.existsSync(__dirname + 'email.html');
    if (!exists) {
        fs.mkdirSync(__dirname + 'email.html');
        console.log('没有文件写进去了');
    }
    console.log('有这个文件');
});

module.exports = router;