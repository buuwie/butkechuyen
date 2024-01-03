const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const user = new Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    is_admin: {
        type: String,
        required: true,
        default: 0
    },
    token: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('User', user);