const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const {check, validationResult} = require('express-validator/check');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const randomString = require('random-string');
const nodemailer = require('nodemailer');

const User = require('../models/user');

mongoose.connect('mongodb://localhost:27017/venspace');
mongoose.Promise= global.Promise;

const checkInputs = (req, res) => {
    // check validity of values
    const result = validationResult(req);
    if (!result.isEmpty()) {
        // there are some validation errors
        //return res.status(400).json({errors: 'Something went wrong, check your input'});
        return res.status(400).json({errors: 'Something went wrong, check your input'});
    }
}
// Register
router.post('/register', [
        check('name')
            .escape()
            .trim()
            .exists(),
        check('email')
            .isEmail()
            .matches(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)
            .escape()
            .trim()
            .exists(),
        check('password')
            .escape()
            .trim()
            .exists()
    ], (req, res) => {;
        checkInputs(req, res);    
        console.log('register', req.body)
        const salt = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync( (req.body.password).toLowerCase(), salt);

        const user = new User({
            name: req.body.name,
            email: req.body.email.toLowerCase(),
            password: hashPass
        })
        
        user.save( (err, result) => {
            if (err) return res.status(500).json({message: err})
            
            return res.status(200).json({message: 'success'});
        });
})

// router.get('/users', (req, res) => {
//     // User.find()
//     //     .then(data => {
//     //         res.status(201).json({datum: data});
//     //     });
//     res.status(200).json({datum: 'whoarda'});
// })

module.exports = router;