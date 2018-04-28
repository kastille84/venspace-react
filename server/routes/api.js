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
    console.log('files', req.files);
    const img1Extra = randomString({length: 5});
    const img2Extra = randomString({length: 5});

    if (req.files) {
        if (req.files.image1) {
            const img1= req.files.image1;
            const img1Name = img1Extra+img1.name;
            img1.mv(path.join(__dirname,"..","/..","/client","/public","/assets","/images","/flyers/", img1Name), (err) => {
                if (err) {
                    console.log('pre')
                    return res.status(500).json({message: 'Could Not mv file'});
                } 
            })
        }
        if (req.files.image2) {
            const img2= req.files.image2;
            const img2Name = img2Extra+img2.name;
            img2.mv(path.join(__dirname,"..","/..","/client","/public","/assets","/images","/flyers/", img2Name), (err) => {
                if (err) {
                    console.log('pre2')
                    return res.status(500).json({message: 'Could Not mv file'});
                } 
            })
        }
    }
    // user
    User.findById(req.body.userId).exec()
        .then(user => {
            console.log('1');
        // places
            Place.findOne({place_id: req.body.placeId}).exec()
                .then(place => {
                    console.log('2');
                    if (place) {
                        console.log('3');
                    // create flyer
                            // get images
                            let imagesArr = [];
                            if (req.files.image1) 
                                imagesArr.push(img1Extra+req.files.image1.name);
                            if (req.files.image2) 
                                imagesArr.push(img2Extra+req.files.image2.name);                                
                        const newFlyer = new Flyer({
                            user_id: user._id,
                            place_id: place._id,
                            heading: req.body.heading,
                            description: req.body.description,
                            contact: {
                                phone: req.body.phone,
                                email: req.body.email
                            },
                            images: imagesArr
                        });
                        newFlyer.save((err, resultFlyer) => {
                            console.log('4');
                            if (err){
                                return res.status(500).json({message: 'could not save flyer'});
                            }
                            // user needs the flyer's id
                            let userFlyer = user.flyers;
                            userFlyer.push(resultFlyer._id)
                            user.update({flyers: userFlyer}).exec()
                                .then( resultUp => {
                                    //everythin is GOOOOOOOD
                                    return res.status(200).json({flyer: resultFlyer});
                                })
                                .catch(err => {
                                    return res.status(500).json({message: 'could not update user'});
                                }); 
                        })
                    } else {
                        console.log('5');
                        // no place found, then create a new place
                        const newPlace = new Place({
                            place_id: req.body.placeId,
                            formatted_address: req.body.formatted_address,
                            name: req.body.name
                        });
                        newPlace.save((err, result) => {
                            console.log('6');
                            if (err){
                                console.log('6.1', err);
                                console.log('formatted', req.body.formatted_address)
                                return res.status(500).json({message: 'could not save new place'});
                            }
                            console.log('7');
                            // create flyer
                                // get images
                                let imagesArr = [];
                                if (req.files.image1) 
                                    imagesArr.push(img1Extra+req.files.image1.name);
                                if (req.files.image2) 
                                    imagesArr.push(img2Extra+req.files.image2.name);                                
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
                                console.log('8');
                                if (err){
                                    return res.status(500).json({message: 'could not save flyer'});
                                }
                                console.log('9');
                                // user needs the flyer's id
                                let userFlyer = user.flyers;
                                userFlyer.push(resultFlyer._id)
                                user.update({flyers: userFlyer}, (err, userResult) => {
                                    if (err) {return res.status(500).json({message: 'could not update user'});}
                                    // return res.status(200).json({flyer: resultFlyer});
                                    return res.status(200);
                                })
                                    // .then( resultUp => {
                                    //     console.log('9.1', resultUp)
                                    //     //everythin is GOOOOOOOD
                                    //     return res.status(200).json({flyer: resultFlyer});
                                    // })
                                    // .catch(err => {
                                    //     console.log('9.2', err)
                                    //     return res.status(500).json({message: 'could not update user'});
                                    // });                                
                            });
                        });
                    }

                })
                .catch(err => {
                    console.log('10');
                    // could not search place
                    return res.status(500).json({message: 'could not search place'})
                });
        })
        .catch(err => {
            console.log('11');
            // no user found
            return res.status(500).json({message: 'could not find user'})
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