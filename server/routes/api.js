const express = require('express');
const path = require('path');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const fs = require('fs');
const {check, validationResult} = require('express-validator/check');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const randomString = require('random-string');
const nodemailer = require('nodemailer');
// AWS S3
const aws = require('aws-sdk');
aws.config.region = 'us-east-1';
const S3_BUCKET = process.env.S3_BUCKET_NAME;

const User = require('../models/user');
const Flyer = require('../models/flyer');
const Place = require('../models/place');

//# mongoose.connect('mongodb://localhost:27017/venspace');
mongoose.connect('mongodb://heroku_x5w15j6f:je15mse68ttvbesn0711bb0pr5@ds229450.mlab.com:29450/heroku_x5w15j6f');
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
                        // get all the Flyers
                        Flyer.find({user_id: user._id}).populate('place_id').exec()
                            .then(flyers => {

                                return res.status(200).json({user: user, flyers: flyers});
                            })
                            .catch(err => {
                                return res.status(500).json({message: 'could not populate flyers'});
                            })
                        
                    } else {
                        return res.status(500).json({message: 'passwords do not match'});
                    }
                })
            })
            .catch(err => {
                return res.status(500).json({message: 'could not look up the user'});
            })

});

// Get Fyers By Location
router.get('/flyers-by-location/:placeId', (req, res) => {
    const place_id = req.params['placeId'];
    Place.findOne({place_id: place_id}).exec()
        .then(place => {
            if (place) {
                console.log('place', place);
                Flyer.find({place_id: place._id}).populate([{path: 'user'}, {path: 'place_id'}]).exec()
                .then(flyers => {
                    if (flyers) {
                        return res.status(200).json({flyers: flyers});
                    } 
                })
                .catch(err => {      
                    return res.status(500).json({message: 'Could Not Search For Flyers'})
                });
            } else {
                // no place found
                return res.status(200).json({noPlace: 'No Place was found'});
            }
        })
        .catch(err => {

        })
    
});

router.get('/flyers-by-user/:userId', (req, res) =>{
    const userId = req.params['userId'];

    Flyer.find({user: userId}).populate([{path: 'user'}, {path: 'place_id'}]).exec()
        .then(flyers => {
                return res.status(200).json({flyers: flyers});            
        })
        .catch(err =>{
            return res.status(500).json({message: 'Could Not Search For Flyers'})
        })
})

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
    
    // const img1Extra = randomString({length: 5});
    // const img2Extra = randomString({length: 5});

    // if (req.files) {
    //     if (req.files.image1) {
    //         const img1= req.files.image1;
    //         const img1Name = formatFileName(img1Extra+img1.name);
    //         //img1.mv(path.join(__dirname,"..","/..","/public","/assets","/images","/flyers/", img1Name), (err) => {
    //         img1.mv(path.join(__dirname,"..","/../client","/build","/static", img1Name), (err) => {
    //             if (err) {
    //                 console.log('pre')
    //                 return res.status(500).json({message: 'Could Not mv file', 
    //                     dir:__dirname,
    //                     dir2flyer: path.join(__dirname,"..","/../client","/build","/static", img1Name)
    //                 });
    //             } 
    //         })
    //     }
    //     if (req.files.image2) {
    //         const img2= req.files.image2;
    //         const img2Name = formatFileName(img2Extra+img2.name);
    //         //img2.mv(path.join(__dirname,"..","/..","/public","/assets","/images","/flyers/", img2Name), (err) => {
    //         img2.mv(path.join(__dirname,"..","/../client","/build","/static", img2Name), (err) => {
    //             if (err) {
    //                 console.log('pre2')
    //                 return res.status(500).json({message: 'Could Not mv file'});
    //             } 
    //         })
    //     }
    // }
    // user
    User.findById(req.body.userId).exec()
        .then(user => {
            console.log('1');
        // places
            Place.findOne({place_id: req.body.placeId}).exec()
                .then(place => {
                    console.log('2');
                    if (place) {
                        console.log('3 ', place);
                    // create flyer
                            // get images
                            let imagesArr = [];
                            if (req.body.image1) 
                                //imagesArr.push(formatFileName(img1Extra+req.files.image1.name));
                                imagesArr.push(req.body.image1);
                            if (req.body.image2) 
                                //imagesArr.push(formatFileName(img2Extra+req.files.image2.name));
                                imagesArr.push(req.body.image2);   
                        console.log('3.1 ', imagesArr);                             
                        const newFlyer = new Flyer({
                            user: user._id,
                            place_id: place._id,
                            heading: req.body.heading,
                            description: req.body.description,
                            contact: {
                                phone: req.body.phone,
                                email: req.body.email
                            },
                            images: imagesArr
                        });
                        console.log('3.2 ', newFlyer);
                        newFlyer.save((err, resultFlyer) => {
                            console.log('4');
                            if (err){
                                return res.status(500).json({message: 'could not save flyer'});
                            }
                            // user needs the flyer's id
                            let userFlyer = user.flyers;
                            userFlyer.push(resultFlyer._id)
                            user.update({flyers: userFlyer}, (err, userResult) => {
                                if (err) {return res.status(500).json({message: 'could not update user'});}
                                // return res.status(200).json({flyer: resultFlyer});
                                return res.status(200).json({message: 'success'});
                            }) 
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
                                if (req.body.image1) 
                                    //imagesArr.push(formatFileName(img1Extra+req.files.image1.name));
                                    imagesArr.push(image1);
                                if (req.body.image2) 
                                    //imagesArr.push(formatFileName(img2Extra+req.files.image2.name));
                                    imagesArr.push(image2);                               
                            const newFlyer = new Flyer({
                                user: user._id,
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
                                    return res.status(200).json({message: 'success'});
                                });                              
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
});

// edit flyer
router.patch('/edit-flyer', [
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
        
    Flyer.findById(req.body.flyerId).exec()
        .then(flyer => {
            console.log('1', flyer);
            let imagesArr = [];

        /** AWS Integration */           
            const s3 = new aws.S3();

            // have image1, image2 
            if (req.body['image1'] && req.body['image2']){
                console.log('2');
                // get their URLs to put in imagesArr
                imagesArr.push(req.body['image1']);
                imagesArr.push(req.body['image2']);

                if (req.body['image1'] !== flyer.images[0]) {
                    console.log('2.1')
                    // delete on aws
                    let params = {
                        Bucket: S3_BUCKET,
                        Delete: {
                            Objects: [
                                {
                                    Key: flyer.images[0].slice(40, flyer.images[0].length)
                                }
                            ]
                        }
                    };
                    console.log('2.1.1')
                    s3.deleteObjects(params, (err, data)=> {
                        if (err){
                            console.log('2.1.2')
                            return res.status(500).json({message: 'failed to delete image1', err: err});
                        }
                       console.log('2.1.3')
                    })
                }  
                
                 // check image 2
                if (req.body['image2'] !== flyer.images[1]) {
                    console.log('2.2')
                    let params2 = {
                        Bucket: S3_BUCKET,
                        Delete: {
                            Objects: [
                                {
                                    Key: flyer.images[1].slice(40, flyer.images[1].length)
                                }
                            ]
                        }
                    }
                    s3.deleteObjects(params2, (err, data) => {
                        if (err){
                            return res.status(500).json({message: 'failed to delete image1'});
                        }

                    })
                }
                
                saveFlyer(req, res, imagesArr, flyer)
                
            } 
            // have image1 but not image2
            else if (req.body['image1'] && !req.body['image2']) {
                console.log('3');
                imagesArr.push(req.body['image1']);
                let Objects2Delete = [];
                if (flyer.images.length > 0) {
                    for ( let img of flyer.images) {
                        if (img !== req.body['image1']) {
                            // you're getting deleted
                            Objects2Delete.push({
                                Key: img.slice(40, img.length)
                            })
                        }
                    }
                    console.log('3.1', Objects2Delete)
                    if (Objects2Delete.length > 0) {
                        let params3 = {
                            Bucket: S3_BUCKET,
                            Delete: {
                                Objects: Objects2Delete
                            }
                        }
                        console.log('3.2', params3.Delete.Objects);
                        try {
                            s3.deleteObjects(params3, (err, data) => {
                                console.log('3.4')
                                if (err){
                                    console.log('3.5', err)
                                    return res.status(500).json({message: 'Failed to delete image1'});
                                }
                                console.log('3.6', data)
                            })
                        } catch ( error ) {
                            console.log('error', error);
                        }
                    }
                }               


                saveFlyer(req, res, imagesArr, flyer);
            }
            // have image2 but not image1
            else if (req.body['image2'] && !req.body['image1']) {
                console.log('4');
                imagesArr.push(req.body['image2']);
                if (flyer.images.indexOf(req.body['image2']) === -1) {
                    // let index = flyer.images.indexOf(req.body['image2']);
                    // let Image2Delete = flyer.images[index].slice(40, flyer.images[index].length);
                    let params4 = {
                        Bucket: S3_BUCKET,
                        Delete: {
                            Objects: [
                                {
                                    Key: flyer.images[1].slice(40, flyer.images[1].length)
                                }
                            ]
                        }
                    }
                    s3.deleteObjects(params4, (err, data) => {
                        if (err){
                            return res.status(500).json({message: 'Failed to delete image1'});
                        }

                    })
                }

                saveFlyer(req, res, imagesArr, flyer);
            }



        /** */
            // // Delete Both, No New
            // if (!req.body['image1'] && !req.body['image2'] && req.files === null) {
                
            //     // unlink both files
            //     fs.unlink(path.join(__dirname,"..","/..","/client","/public","/assets","/images","/flyers/", flyer.images[0]), (err) => {
            //         if(err) return res.status(500).json({message: 'Could not delete image'});
            //         fs.unlink(path.join(__dirname,"..","/..","/client","/public","/assets","/images","/flyers/", flyer.images[1]), (err) => {
            //             if (err) return res.status(500).json({message: 'Could not delete image'});
                        
            //             saveFlyer(req, res, imagesArr, flyer);
            //         })
            //     })
            // }
            // // no image files were deleted
            //  else if (req.body.image1 && req.body.image2) {
            //     imagesArr.push(req.body.image1);
            //     imagesArr.push(req.body.image2);
            // }
            // // delete 1st image, 2nd original
            // else if (req.files.image1 && req.body.image2) {
                
            //     // logic for unlinking the image1 a file
            //     fs.unlink(path.join(__dirname,"..","/..","/client","/public","/assets","/images","/flyers/", flyer.images[0]), (err) => {
            //         if (err) return res.status(500).json({message: 'Could not delete image'});
            //     })
            //     // logic for moving New Image1 file
            //     const img1Name = formatFileName(img1Extra+req.files.image1.name);
            //     req.files.image1.mv(path.join(__dirname,"..","/..","/client","/public","/assets","/images","/flyers/", img1Name), (err) => {
            //         if (err) {
            //             return res.status(500).json({message: 'Could Not mv file'});
            //         } 
            //         imagesArr.push(img1Name)
            //         imagesArr.push(req.body.image2);
            //         saveFlyer(req, res, imagesArr, flyer);
            //     })
            // }
            // //Leaver image1-original & image2-new
            // else if (req.body.image1 && req.files.image2) {
            //     // logic for unlinking the image2 a file
            //     fs.unlink(path.join(__dirname,"..","/..","/client","/public","/assets","/images","/flyers/", flyer.images[1]), (err) => {
            //         if (err) return res.status(500).json({message: 'Could not delete image'});
                    
            //     })
            //     // logic for moving New Image2 file
            //     const img2Name = formatFileName(img2Extra+req.files.image2.name);
            //     req.files.image2.mv(path.join(__dirname,"..","/..","/client","/public","/assets","/images","/flyers/", img2Name), (err) => {
            //         if (err) {
            //             return res.status(500).json({message: 'Could Not mv file'});
            //         } 
            //         imagesArr.push(req.body.image1)
            //         imagesArr.push(img2Name);
            //         // call the function when ready
            //         saveFlyer(req, res, imagesArr, flyer);
            //     })
                
            // }            
            // // Delete Both, Add Image1, no image2
            // else if (req.files.image1 && !req.files.image2 && !req.body['image1'] && !req.body['image2']) {
                
            //     // unlink both files
            //     fs.unlink(path.join(__dirname,"..","/..","/client","/public","/assets","/images","/flyers/", flyer.images[0]), (err) => {
            //         if(err) return res.status(500).json({message: 'Could not delete image'});
            //         fs.unlink(path.join(__dirname,"..","/..","/client","/public","/assets","/images","/flyers/", flyer.images[1]), (err) => {
            //             if (err) return res.status(500).json({message: 'Could not delete image'});
            //             // logic for moving New Image1 file
            //             const img1Name = formatFileName(img1Extra+req.files.image1.name);
            //             req.files.image1.mv(path.join(__dirname,"..","/..","/client","/public","/assets","/images","/flyers/", img1Name), (err) => {
            //                 if (err) {
            //                     return res.status(500).json({message: 'Could Not mv file'});
            //                 } 
            //                 imagesArr.push(img1Name);
            //                 saveFlyer(req, res, imagesArr, flyer);
            //             });  
            //         });
            //     });
                              
            // }
            // // Delete Both, Add Image1 & Image 2
            // else if (req.files.image1 && req.files.image2) {
            //     console.log('got here');

            //     // check if they already have images in their db
            //     if (flyer.images.length === 2) {
            //         // unlink both files
            //         fs.unlink(path.join(__dirname,"..","/..","/client","/public","/assets","/images","/flyers/", flyer.images[0]), (err) => {
            //             if(err) return res.status(500).json({message: 'Could not delete image'});
                        
            //             fs.unlink(path.join(__dirname,"..","/..","/client","/public","/assets","/images","/flyers/", flyer.images[1]), (err) => {
            //                 if (err) return res.status(500).json({message: 'Could not delete image'});
            //                 // logic for moving New Image1 file
            //                 const img1Name = formatFileName(img1Extra+req.files.image1.name);
            //                 req.files.image1.mv(path.join(__dirname,"..","/..","/client","/public","/assets","/images","/flyers/", img1Name), (err) => {
            //                     if (err) {
            //                         return res.status(500).json({message: 'Could Not mv file'});
            //                     } 
                                
            //                     // logic for moving New Image2 file
            //                     const img2Name = formatFileName(img2Extra+req.files.image2.name);
            //                     req.files.image2.mv(path.join(__dirname,"..","/..","/client","/public","/assets","/images","/flyers/", img2Name), (err) => {
            //                         if (err) {
            //                             return res.status(500).json({message: 'Could Not mv file'});
            //                         } 
            //                         imagesArr.push(img1Name);
            //                         imagesArr.push(img2Name);
    
            //                         saveFlyer(req, res, imagesArr, flyer);
            //                     });
            //                 });
            //             });
            //         });
            //     } else if (flyer.images.length === 1){
            //         // 1 image to begin with
            //         // logic for unlinking the image1 a file
            //         fs.unlink(path.join(__dirname,"..","/..","/client","/public","/assets","/images","/flyers/", flyer.images[0]), (err) => {
            //             if (err) return res.status(500).json({message: 'Could not delete image'});
            //         })
            //          // logic for moving New Image1 file
            //          const img1Name = formatFileName(img1Extra+req.files.image1.name);
            //          req.files.image1.mv(path.join(__dirname,"..","/..","/client","/public","/assets","/images","/flyers/", img1Name), (err) => {
            //              if (err) {
            //                  return res.status(500).json({message: 'Could Not mv file'});
            //              } 
                         
            //              // logic for moving New Image2 file
            //              const img2Name = formatFileName(img2Extra+req.files.image2.name);
            //              req.files.image2.mv(path.join(__dirname,"..","/..","/client","/public","/assets","/images","/flyers/", img2Name), (err) => {
            //                  if (err) {
            //                      return res.status(500).json({message: 'Could Not mv file'});
            //                  } 
            //                  imagesArr.push(img1Name);
            //                  imagesArr.push(img2Name);

            //                  saveFlyer(req, res, imagesArr, flyer);
            //              });
            //          });
            //     } else if (flyer.images.length === 0) {
            //         // NO IMAGES TO BEGIN WITH
            //          // logic for moving New Image1 file
            //          const img1Name = formatFileName(img1Extra+req.files.image1.name);
            //          req.files.image1.mv(path.join(__dirname,"..","/..","/client","/public","/assets","/images","/flyers/", img1Name), (err) => {
            //              if (err) {
            //                  return res.status(500).json({message: 'Could Not mv file'});
            //              } 
                         
            //              // logic for moving New Image2 file
            //              const img2Name = formatFileName(img2Extra+req.files.image2.name);
            //              req.files.image2.mv(path.join(__dirname,"..","/..","/client","/public","/assets","/images","/flyers/", img2Name), (err) => {
            //                  if (err) {
            //                      return res.status(500).json({message: 'Could Not mv file'});
            //                  } 
            //                  imagesArr.push(img1Name);
            //                  imagesArr.push(img2Name);

            //                  saveFlyer(req, res, imagesArr, flyer);
            //              });
            //          });
            //     }                 
            // }
    }) 
    .catch(err => {
        return res.status(500).json({err: err});
    });        
});

router.delete('/delete-flyer/:_id', (req, res) => {
    const id = req.params['_id'];

    Flyer.findByIdAndRemove(id, (err, deletedFlyer) => {
        if (err) {
            return res.status(500).json({message: 'Could Not Remove'});
        }
        if (deletedFlyer) {
            // Delete any stored images 
            if (deletedFlyer.images.length === 2) {
                // unlink both files
                fs.unlink(path.join(__dirname,"..","/..","/client","/public","/assets","/images","/flyers/", deletedFlyer.images[0]), (err) => {
                    if(err) return res.status(500).json({message: 'Could not delete image'});
                    
                    fs.unlink(path.join(__dirname,"..","/..","/client","/public","/assets","/images","/flyers/", flyer.images[1]), (err) => {
                        if (err) return res.status(500).json({message: 'Could not delete image'});
                        
                    });
                });
            } else if (deletedFlyer.images.length === 1) {
                // unlink iamge1 files
                fs.unlink(path.join(__dirname,"..","/..","/client","/public","/assets","/images","/flyers/", deletedFlyer.images[0]), (err) => {
                    if(err) return res.status(500).json({message: 'Could not delete image'});
                });
            }

            // delete from user
            User.findById(deletedFlyer.user, (err, user) => {
                if (err) {
                    return res.status(500).json({message: 'Could Not Remove from user'});
                }
                if (user) {
                    let flyersArr = user.flyers.filter(flyer => {
                        if (flyer === deletedFlyer._id) {
                            return false;
                        }
                        return true;
                    });

                    user.flyers = flyersArr;
                    user.save( (err, newUser) => {
                        if (err) {
                            return res.status(500).json({message: 'could not save user'});
                        }
                        return res.status(200).json({message: 'success'});
                    });

                } else {
                    // no user
                    return res.status(500).json({message: 'Could Not Find User to Remove its flyer'});
                }
            })

        } else {
            // could not find flyer
            return res.status(500).json({message: 'Could Not Find Flyer to Remove'});
        }
    });
});

//  S3
router.get('/sign-s3', (req, res) => {
    const s3 = new aws.S3();
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
            console.log(err);
            return res.end();
        }

        return res.status(200).json({
            signedRequest: data,
            url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
        });

    });
})



function saveFlyer(req, res, imagesArr, flyer) {
    const contactObj = {
        phone: req.body.phone,
        email: req.body.email
    };
    flyer.heading = req.body.heading;
    flyer.description = req.body.description;
    flyer.contact = contactObj;
    flyer.images = imagesArr;
    console.log('flyer.images',flyer.images);
    flyer.save( (err, newFlyer) => {
        if (err) {
            return res.status(500).json({message: 'Could Not update Flyer'});
        }
        return res.status(200).json({message: 'flyer updated successfully', newFlyer: newFlyer})
    });


}

// router.get('/users', (req, res) => {
//     // User.find()
//     //     .then(data => {
//     //         res.status(201).json({datum: data});
//     //     });
//     res.status(200).json({datum: 'whoarda'});
// })

const formatFileName = (str) => {
    let newStr = '';
    for( s of str) {
        if (s === '-' || s === ' ') {
            newStr += "_";
        } else {
            newStr += s;
        }
    }
    return newStr;
}

module.exports = router;