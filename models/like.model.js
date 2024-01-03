const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const like = new Schema({
    post_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    type:{
        type:Number,
        required:true
    }
});

module.exports = mongoose.model('Like', like)