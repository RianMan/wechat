const mongoose = require('mongoose');
const { resolve } = require('path');
const glob = require('glob')

mongoose.Promise = global.Promise;

exports.connect = (db) => {
    return new Promise(resolve => {
        mongoose.connect(db, {useNewUrlParser:true});
        mongoose.connection.on('disconnect',()=>{console.log('断开连接')})
        mongoose.connection.on('open',()=>{
            resolve();
            console.log('mongodb 数据库成功连接')
        })
    })
};

exports.initSchemas = () => {
    glob.sync(resolve(__dirname,'./schema','**/*.js')).forEach(require);
}