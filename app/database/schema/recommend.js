const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const CommendSchema = new Schema({
    title: String,
    content: String,
    createTime: String,
    image: String,
    like: {
        default:0,
        type: Number
    },
    watched: Number,
});

CommendSchema.statics = {
    async getCommendList () {
        const list = await this.find();
        return list;
    },
    async getCommendDetail (id) {
        const one = await this.findOne({
            _id:id,
        });
        return one;
    },
    async saveCommend ({title,content,image}) {
        commend = new Commend({
            title,
            content,
            image,
            createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        })
        await commend.save();
        return commend;
    },
    async addlike (id) {
        const one = await this.findOneAndUpdate({_id:id},{
            $inc: { like: 1 }
        }, { new: true });
        return one;
    },
}

const Commend = mongoose.model('Commend',CommendSchema);
