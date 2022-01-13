module.exports = {
  mongoCode: 'mongodb+srv://wangpeng:<password>@cluster0.0wsu0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  mongoURI: 'mongodb://localhost/node-api',
  mongoURIProt: 'mongodb://nodeproduct:nodeproduct123456@127.0.0.1/nodeproduct',
  // 链接本地数据库
  secretOrKey: 'secret'
  // 验证 Jwt ken
}

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
/*  db.createUser({
  user: 'nodeproduct',
  pwd: 'nodeproduct123456',
  roles: [{ role: 'dbOwner', db: 'nodeproduct' }]
})
服务器生产环境
*/
