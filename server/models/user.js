const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { 
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    flyers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flyer'
    }]

});

module.exports = mongoose.model("User", schema);