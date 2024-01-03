const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const setting = new Schema ({

    post_limit: {
        type: Number,
        required: true
    }

});

module.exports = mongoose.model('Setting', setting)