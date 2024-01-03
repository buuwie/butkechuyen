const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const post = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    views: {
        type: Number,
        default: 0
    },
    comments: {
        type: Object,
        default: {}
    }
});

module.exports = mongoose.model('Post', post);