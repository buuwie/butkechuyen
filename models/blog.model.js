const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const blog = new Schema({

    blog_title: {
        type: String,
        required: true
    }
    ,
    blog_image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Blog', blog);