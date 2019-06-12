const sha1 = require('js-sha1');
const getRawBody = require('raw-body');
const answer = require('../util/answer');
const xmlTool = require('../util/xmlTool') 

module.exports = (config) => {
    return async (ctx) => {
        const { token } = config;
        const { signature, nonce, timestamp,echostr} = ctx.query;
        const str = [token, timestamp, nonce].sort().join('');
        const sha = sha1(str);
        if(ctx.method === 'GET'){
            ctx.body = sha === signature ? echostr + '' : 'failed'
        }else if(ctx.method === 'POST'){
            if(sha === signature ){
                const xml = await getRawBody(ctx.req,{
                    length: ctx.length,
                    limit:'1mb',
                    encoding: ctx.charset,
                })
                let result = await xmlTool.parseXML(xml);
                let message = await xmlTool.formatMessage(result.xml);
                if (message.MsgType === 'text') {
                    ctx.body = answer.text(message)
                } else if (message.MsgType === 'event') {
                    ctx.body = answer.location(message);
                } else {
                    return 'success'
                }
            }else{
                ctx.body =  'failed';
            }
        }
    }
}