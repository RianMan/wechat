const request = require('request-promise')

// opRLg5zW65GHD57i3tAteGxtZ7Gg
const base = 'https://api.weixin.qq.com/cgi-bin/';


const api = {
    access_token:'token?grant_type=client_credential',
}
class Wechat{
    constructor(config){
        this.appId = config.appId;
        this.secret = config.appsecret;
        this.getAccessToken = config.getAccessToken;
        this.saveAccessToken = config.saveAccessToken;
        this.featchAccessToken()
    }

    async request(options){
        options = Object.assign({},options,{json:true});
        try {
            const res = await request(options);
            return res;
        } catch (error) {
            console.log(error)
        }
    }


    /**
     * 1.首先检查数据库里的token有没有过期，
     * 2.过期则刷新
     * 3.token 入库 
     */
    async featchAccessToken() {
        let data = await this.getAccessToken()
        if(!this.isValidToken(data)){
            data = await this.updateAccessToken();
        }
       
        await this.saveAccessToken(data);

        return data;
    }

    //获取tokentoken
    async updateAccessToken() {
        const uri = `${base}${api.access_token }&appid=${this.appId}&secret=${this.secret}`;
        //这个uri就是拼接好的地址
        const data = await this.request({uri});
        /**
        { access_token:
            '21_PqJi57F6vHyITd52Ilrct8UGXoboWkb97qhGlpev-F5sdRDtCvrWQWBPUA2c1_xax8YtoUGxFx4sjV3a4DF-cmlA-uRZBvPjujde35I7qDQCww35h-vqGSctD2wWM3A9PpULKK-RhW8jWkVWIJJhAAADEE',
            expires_in: 7200 }
        */   
        const now = new Date().getTime();
        const expiresIn = now + (data.expires_in - 20 ) * 1000;
        data.expires_in = expiresIn;
        return data;
    }

    //校验token
    isValidToken(data){
        if(!data || !data.expires_in){
            return false;
        }
        const { expiresIn } = data;
        const now = new Date().getTime();
        return now < expiresIn;
    }

}

module.exports = Wechat;