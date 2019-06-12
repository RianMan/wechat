const Router = require('koa-router');
const request = require('request-promise');
const mongoose = require('mongoose');
const {wechat_cof} = require('../../config/config');
/* 微信登陆 */
const AppID = wechat_cof.appId;
const AppSecret = wechat_cof.appsecret;

const router = new Router();

router.get('/wx_login', function(ctx, next){
    // 第一步：用户同意授权，获取code
    // 这是编码后的地址
    var return_uri = encodeURIComponent('http://shawvi.free.idcfengye.com/wxcallback');
    var scope = 'snsapi_userinfo';
    ctx.response.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid='
    +AppID+'&redirect_uri='+
    return_uri+'&response_type=code&scope='
    +scope+
    '&state=STATE#wechat_redirect');
});

router.get('/wxcallback',async (ctx, next) => {
    // 第二步：通过code换取网页授权access_token
    var code = ctx.query.code;
    let authUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+AppID+'&secret='+AppSecret+'&code='+code+'&grant_type=authorization_code';
    let authData = await request(authUrl);
    let {access_token,openid} = JSON.parse(authData)
    let userInfoUrl = 'https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token +
    '&openid=' + openid +
    '&lang=zh_CN';
    let data = await request(userInfoUrl);
    let parseData = JSON.parse(data);
    const User = mongoose.model('User');
    const res = await User.getUser(parseData.nickname);
    if(!res){
        await User.saveUser({
            name:parseData.nickname,
            imgsrc:parseData.headimgurl,
            sex: parseData.sex,
            area:`${parseData.country} ${parseData.province} ${parseData.city}` 
        });
    }else{
        ctx.response.redirect('/todayrecommend');
    }
});


router.get('/todayrecommend',async (ctx, next) => {
    const Commend = mongoose.model('Commend');
    const list = await Commend.getCommendList();
    await ctx.render('recdetail',{data: list[list.length - 1]});
});

router.get('/historylist',async (ctx, next) => {
    const Commend = mongoose.model('Commend');
    const list = await Commend.getCommendList();
    await ctx.render('historylist',{list});
});


router.get('/recdetail/:id',async (ctx, next) => {
    console.log(ctx.params.id)
    const Commend = mongoose.model('Commend');
    const data = await Commend.getCommendDetail(ctx.params.id);
    await ctx.render('recdetail',{data: data || {}});
});

router.get('/addlike',async (ctx, next) => {
    const Commend = mongoose.model('Commend');
    let data = await Commend.addlike(ctx.query.id);
    ctx.body = {
        data,
        code: 1,
    }
});

module.exports = router;