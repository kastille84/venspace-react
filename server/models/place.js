const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    place_id: {
        type: String,
        required: true
    },
    formatted_address: {
        type: String

    },
    name: {
        type: String
    }
})

module.exports = mongoose.model('Place', schema);