const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode:"development",
  entry:'./src/index.js',
  context:process.cwd(),
  output:{
    path:path.resolve(__dirname,"./dist"),
    filename:"boundle.js"
  },
  devServer:{
    host:"localhost",
    port:"3010",
    setupMiddlewares: (middlewares, devServer) => {
      let router = devServer.app;
      router.get('/ajax/success',(req,res)=>{
        res.sendStatus(200);
      })
      router.get('/ajax/error',(req,res)=>{
        res.sendStatus(500);
      })
      router.get('/ajax/cancel',(req,res)=>{
        setTimeout(() => {
          res.sendStatus(200);
        }, 5000);
      })

      return middlewares;
    }
  },
  plugins:[
    new HtmlWebpackPlugin({
      template:path.resolve(__dirname,"./example/jsError.html"),
      append:"head",
    })
  ]
}