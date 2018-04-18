const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;

const User = require('../models/user');

mongoose.connect('mongodb://localhost:27017/mern');
mongoose.Promise= global.Promise;

router.get('/users', (req, res) => {
    // User.find()
    //     .then(data => {
    //         res.status(201).json({datum: data});
    //     });
    res.status(200).json({datum: 'whoarda'});
})

module.exports = router;