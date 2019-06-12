const { wechat_cof } = require('../config/config');
const Wechat = require('../wechat-lib');
const mongoose = require('mongoose');
const Token = mongoose.model('Token');

//获取access_token
const _config = Object.assign(wechat_cof,{
    getAccessToken: async () => {
        const res = await Token.getAccessToken();
        return res;
    },
    saveAccessToken: async (data) => {
        const res = await Token.saveAccessToken(data);
        return res;
    }
});
exports.test = async () => {
    const client = new Wechat(_config);
    const data = await client.featchAccessToken();
}