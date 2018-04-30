const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    place_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    },
    heading: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: Array,
        default: []
    },
    contact: {
        type: Object
    }
});

module.exports = mongoose.model('Flyer', schema);