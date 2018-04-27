const express = require('express');
const path = require('path');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const {check, validationResult} = require('express-validator/check');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const randomString = require('random-string');
const nodemailer = require('nodemailer');

const User = require('../models/user');
const Flyer = require('../models/flyer');
const Place = require('../models/place');

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
        check('phone')
            .escape()
            .trim()
            .exists(),
        check('password')
            .escape()
            .trim()
            .exists()
    ], (req, res) => {;
        checkInputs(req, res);    
        const salt = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync( (req.body.password).toLowerCase(), salt);

        const user = new User({
            name: req.body.name,
            email: req.body.email.toLowerCase(),
            phone: req.body.phone,
            password: hashPass
        })

        user.save( (err, result) => {
            if (err) return res.status(500).json({message: err})
            
            return res.status(200).json({message: 'success'});
        });
})

// Signin
router.post('/signin', [
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
    ], (req, res) => {
        checkInputs(req, res);

        User.findOne({email: req.body.email}).exec()
            .then(user => {
                // compare passwords
                bcrypt.compare(req.body.password, user.password, (err,same) => {
                    if (err) {
                        return res.status(500).json({message: 'could not check password'});
                    }
                    if (same) {
                        return res.status(200).json({user: user});
                    } else {
                        return res.status(500).json({message: 'passwords do not match'});
                    }
                })
            })
            .catch(err => {
                return res.status(500).json({message: 'could not look up the user'});
            })

});

// make Flyer
router.post('/make-flyer', [
    check('heading')
        .exists()
        .escape()
        .trim(),
    check('description')
        .escape()
        .exists()
        .trim()
], (req, res) =>{
    checkInputs(req, res);
    console.log(req.body);
    console.log('files',req.files)
    // user
    User.findById(req.body.userId).exec()
        .then(user => {
        // places
            Place.findOne({place_id: req.body.place_id}).exec()
                .then(place => {
                    if (place) {

                    } else {
                        // no place found, then create a new place
                        const newPlace = new Place({
                            place_id: req.body.selectedPlace.place_id,
                            formatted_address: req.body.selectedPlace.formatted_address,
                            name: req.body.selectedPlace.name
                        });
                        newPlace.save((err, result) => {
                            if (err){
                                res.status(500).json({message: 'could not save new place'});
                            }
                            // create flyer
                                // get images
                                let imagesArr = [];
                                if (req.files.image1) 
                                    imagesArr.push(req.files.image1.name);
                                if (req.files.image2) 
                                    imagesArr.push(req.files.image2.name);                                
                            const newFlyer = new Flyer({
                                user_id: user._id,
                                place_id: result._id,
                                heading: req.body.heading,
                                description: req.body.description,
                                contact: {
                                    phone: req.body.phone,
                                    email: req.body.email
                                },
                                images: imagesArr
                            });
                            newFlyer.save((err, resultFlyer) => {
                                if (err){
                                    res.status(500).json({message: 'could not save flyer'});
                                }
                                // user needs the flyer's id
                                let userFlyer = user.flyers;
                                userFlyers.push(resultFlyer._id)
                                user.update({flyers: userFlyers});
                                //everythin is GOOOOOOOD
                                
                            })
                        });
                    }

                })
                .catch(err => {
                    // could not search place
                })
        // flyers

        })
        .catch(err => {
            // no user found
        })
    

    if (req.files) {
        if (req.files.image1) {
            const img1= req.files.image1;
            const img1Name = img1.name;
            img1.mv(path.join(__dirname,"..","/..","/client","/public","/assets","/images","/flyers/", img1Name), (err) => {
                if (err) {
                    return res.status(500).json({message: 'Could Not mv file'});
                } else {
                    return res.status(200).json({message: 'mv done'});
                }
            })
        }
        if (req.files.image2) {
            const img2= req.files.image2;
            const img2Name = img2.name;
            img2.mv(path.join(__dirname,"..","/..","/client","/public","/assets","/images","/flyers/", img2Name), (err) => {
                if (err) {
                    return res.status(500).json({message: 'Could Not mv file'});
                } else {
                    return res.status(200).json({message: 'mv done'});
                }
            })
        }
    }
})

// router.get('/users', (req, res) => {
//     // User.find()
//     //     .then(data => {
//     //         res.status(201).json({datum: data});
//     //     });
//     res.status(200).json({datum: 'whoarda'});
// })

module.exports = router;