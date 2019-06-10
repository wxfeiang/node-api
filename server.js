const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const app = express();
//users/.js
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const blog = require("./routes/api/blog");
// 请求静态json
const acjson = require("./routes/api/acjson");
//DB
const db = require("./config/keys").mongoURI;
mongoose
    .connect(db, {
        useNewUrlParser: true
    })
    .then(() => console.log("数据库链接成功"))
    .catch(err => console.log(err));
// Connect to mongodb

// bodyParser 中间件使用
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 使用中间件实现允许跨域
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
});

// 初始化
app.use(passport.initialize());
require("./config/passport")(passport); // 数据分离

//  根路径
app.get("/", (req, res) => {
    res.send("这里是项目跟路径");
});

app.use("/api/users", users); // 上面引入进来的
app.use("/api/profile", profile);
app.use("/api/posts", posts);
app.use("/api/blog", blog);
app.use("/api/acjson", acjson);

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server  running  on prot  ${port}`);
});
