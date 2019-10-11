module.exports = {
    //暂时注释
    //  mongoURI: 'mongodb://node-api:node258@ds233258.mlab.com:33258/node-api',
    //  新地址
    mongoURI: 'mongodb+srv://wxfeiang:wpazwx1314>@cluster0-r1nin.mongodb.net/test?retryWrites=true&w=majority',

    //  'mongodb://localhost/node-api',
    // 链接本地数据库
    secretOrKey: 'secret'
        // 验证 Jwt ken
};

/*
if(process.env.NODE_ENV =="production"){
   module.exports =
   {mongoURL:" mongodb:Mr wang:wp258258***@ds053459.mlab.com:53459/node-app-pr" }
}else{
   // 开发环境
   module.exports =
   {mongoURL:"mongodb://localhost/node-app" }
} 
//  引入 database
const db = require("./config/database")
// 链接数据库  端口 库名  本地  远程数据库
mongoose.connect(db.mongoURL,{useNewUrlParser:true})
 .then(() => {
   console.log("链接成功");
 })
 .catch(err => {
   console.log(err+"链接失败");
 });
*/