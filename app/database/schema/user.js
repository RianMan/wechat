const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    imgsrc: String,
    sex: Number,
    area: String,
});

UserSchema.statics = {
    async getUser (name) {
        const user = await this.findOne({
            name: name,
        });
        return user;
    },
    async saveUser ({name,imgsrc,sex,area}) {
        user = new User({
            name,
            imgsrc,
            sex,
            area,
        })
        await user.save();
        return user;
    },
}

const User = mongoose.model('User',UserSchema);
