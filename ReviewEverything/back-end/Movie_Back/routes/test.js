const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/data');

let mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', (callback) => {

});

const reviewSchema = mongoose.Schema({
    user_id: String,
    userfname: String,
    userlname: String,
    review: String,
    rating: Number
})

const userSchema = mongoose.Schema({
    city: String,
    email: String,
    fname: String,
    lname: String,
    password: String,
    phone: String,
    state: String,
    street: String,
    zip_code: String
})

<<<<<<< HEAD
const Review = mongoose.model('reviews', reviewSchema)
=======
const RR = mongoose.model('reviews', reviewSchema)
>>>>>>> parent of 50b8595... Stars

const User = mongoose.model('users', userSchema);

router.get('/', function(req, res) {
    console.log('WE ARE HERE!!!')
    User.find((err, users) => {
        // console.log("BRUH")
        // console.log(User_Profiles.city)
        if (err) console.log(err);
        let userCollection = {};

        users.forEach((user) => {
            console.log(user);
         userCollection[user._id] = user;
        });
      
    res.send(userCollection);
    
   });
});

router.post('/submitReview', function(req, res) {
    console.log('\nSubmitting data...\n');
    console.log('Review submitted: ' + req.body.review);
    console.log('Rating submitted: ' + req.body.rating);
    var r = new RR({review: req.body.review, rating: req.body.rating})
    r.save(function(err){
        if(err)
            throw err;
        else  
            console.log('saved!')
    })
});

router.post('/submitReview', function(req, res) {
    console.log('\nSubmitting data...\n');
    console.log('Review submitted: ' + req.body.review);
    console.log('Rating submitted: ' + req.body.rating);
    var r = new Review({ user_id: req.body.userId, userfname: req.body.userfname, userlname: req.body.userlname, review: req.body.review, rating: req.body.rating})
    r.save(function(err){
        if(err)
            throw err;
        else  
            console.log(r.userfname + "'s review saved!");
    })
});

router.post('/login', function(req, res) {
    // if(req.body.email != null && req.body.password != null) {
    //     status = true
    // } else {
    //     status = false
    // }
    console.log('\nChecking data...\n');
    console.log('Email submitted: ' + req.body.email);
    console.log('Password submitted(unhashed): ' + req.body.password);
    console.log(req.body.message)
   
    if(req.body.email != null && req.body.password != null) {
        let status = false;
        User.findOne({'email': req.body.email}, function(err, User_Profiles) {
            if(!User_Profiles) {
                let statusMessage = 'The EMAIL you entered was incorrect.'
                res.send({status, statusMessage});
            }
            else if(User_Profiles) {
                bcrypt.hash(req.body.password, saltRounds).then((hash) => {
                    console.log("\nHashed password: " + hash + ".\n");
                })
                bcrypt.compare(req.body.password, User.password).then((res2) => {
                    if(res2 == true) {
                        status = !status;
                        res.send({status, User_Profiles});
                    } else {
                        let statusMessage = 'The PASSWORD you entered was incorrect.'
                        res.send({status, statusMessage})
                    }
                });
            }
        });
    } else {
        let status = false;
        let statusMessage = "You're submitting nothing. Please enter something into the text boxes before submitting."
        res.send({status, statusMessage});
    }
});

router.get('/hash', (req, res) => {
    console.log(req.body.message)
    User.find((err, users) => {
        if (err) console.log(err);
        users.forEach((user) => {
            bcrypt.hash(user.password, saltRounds).then((hash) => {
                User.findById(user._id, (err, currentUser) => {
                    if (err) return console.log(err);
                    currentUser.fname = user.fname,
                    currentUser.lname = user.lname,
                    currentUser.street = user.street,
                    currentUser.city = user.city,
                    currentUser.state = user.state,
                    currentUser.zip_code = user.zip_code,
                    currentUser.email = user.email,
                    currentUser.password = hash,
                    currentUser.phone = user.phone
<<<<<<< HEAD
                    console.log("HELLO?")
                    currentUser.save((err, User_Profiles) => {
=======

                    currentUser.save((err, user) => {
>>>>>>> parent of 50b8595... Stars
                        if(err) return console.log(err);
                        console.log('\n' + User_Profiles.fname + ' ' + User_Profiles.lname + "'s password is now: " + hash + '.\n');
                    });
                });
            });
        });
        let message = 'The deed is done.';
        res.send(message);
   });
});

module.exports = router;

