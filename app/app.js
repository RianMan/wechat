const Koa = require('koa');
//鉴权中间价
const auth = require('./wechat-lib/middleware');
//微信配置
const { wechat_cof, db } = require('./config/config'); 

const { initSchemas,connect } = require('./database/init');

const router = require('./database/router/index.js');
//缓存koa-static-cache
const staticCache = require('koa-static-cache')

const views = require('koa-views');

const path = require('path');


;(async () => {
    await connect(db);

    initSchemas();
    
    //必须保证mongodb服务器连接起来了才可以连接
    const { test } = require('./wechat');
    await test();
    const app = new Koa();
  
    app.use(staticCache(path.join(__dirname, './database/public'), { dynamic: true }, {
        maxAge: 365 * 24 * 60 * 60
    }))

    app.use(views(path.resolve(__dirname ,'./database/views'),{extension:'ejs'}));

    app.use(router.routes()).use(router.allowedMethods());;
   

    app.use(auth(wechat_cof));
    
   
    
    app.listen(9000);
    console.log("node服务成功",'localhost:9000')
})()
