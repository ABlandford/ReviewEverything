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
    username: String,
    review: String,
    rating: String, 
    userfname: String, 
    userlname: String, 
    userId: String, 
    movieId: Number, 
    email: String,
})


const userSchema = mongoose.Schema({
    username: String,
    fname: String,
    lname: String,
    street: String,
    city: String,
    state: String,
    zip_code: String,
    email: String,
    password: String,
    phone: String
})

const RR = mongoose.model('reviews', reviewSchema)

const User = mongoose.model('users', userSchema)
    
router.get('/', function(req, res) {
    User.find((err, users) => {
        if (err) console.log(err);
        let userCollection = {};
        users.forEach((user) => {
            userCollection[user._id] = user;
        });
      
    res.send(userCollection);
   });
});

router.post('/submitReview', function(req, res) {
    console.log('\nSubmitting data...\n');
    console.log('Review submitted: ' + req.body.review);
    console.log('Rating submitted: ' + req.body.rating);
    console.log('Review username ' + req.body.email);
    console.log("Review UserId " + req.body.userId)
    var r = new RR({review: req.body.review, rating: req.body.rating, username: req.body.email, movieId: req.body.movieId, userId: req.body.userId})
    r.save(function(err){
        if(err)
            throw err;
        else  
            console.log('saved!')
    })
});

router.post('/login', function(req, res) {
    console.log('\nChecking data...\n');
    console.log('Email submitted: ' + req.body.email);
    console.log('Password submitted(unhashed): ' + req.body.password);
   
    if(req.body.email != null && req.body.password != null) {
        let status = false;
        User.findOne({'email': req.body.email}, function(err, user) {
            if(!user) {
                let statusMessage = 'The EMAIL you entered was incorrect.'
                res.send({status, statusMessage});
            }
            else if(user) {
                bcrypt.hash(req.body.password, saltRounds).then((hash) => {
                    console.log("\nHashed password: " + hash + ".\n");
                })
                bcrypt.compare(req.body.password, user.password).then((res2) => {
                    if(res2 == true) {
                        status = !status;
                        res.send({status, user});
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

router.post('/signup', function(req, res) {
    console.log('Checking data...');
    console.log('Information submitted: ' + req.body);
    bcrypt.hash(req.body.password, saltRounds).then((hash) => {
        const newUser = new User({
            fname: req.body.fname,
            lname: req.body.lname,
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            zip_code: req.body.zip_code,
            email: req.body.email,
            password: hash,
            phone: req.body.phone
        })

        newUser.save((err, user) => {
            if (err) return console.log(err);
            console.log(user.fname + ' added!')
        });

        return res.send(newUser)
    });
});

router.get('/addusername', (req, res) => {
    User.find((err, users) => {
        if (err) console.log(err);
        users.forEach((user) => {
            const username = user.fname + user.lname.slice(0,1);
            User.findById(user._id, (err, currentUser) => {
                if (err) return console.log(err);
                currentUser.username = username,
                currentUser.fname = user.fname,
                currentUser.lname = user.lname,
                currentUser.street = user.street,
                currentUser.city = user.city,
                currentUser.state = user.state,
                currentUser.zip_code = user.zip_code,
                currentUser.email = user.email,
                currentUser.password = user.password,
                currentUser.phone = user.phone

                currentUser.save((err, user) => {
                    if(err) return console.log(err);
                    console.log(user.username + ' saved!');
                });
            });
        });
        let message = 'Users now have usernames.'
        res.send(message);
    });
});

// router.get('/hash', (req, res) => {
//     User2.find((err, users) => {
//         if (err) console.log(err);
//         console.log("!!!")
//         users.forEach((user) => {
//             console.log("???")
//             console.log(user.fname + " " + user.lname);
//             bcrypt.hash(user.password, saltRounds).then((hash) => {
//                 User2.findById(user._id, (err, currentUser) => {
//                     if (err) return console.log(err);
//                     currentUser.fname = user.fname,
//                     currentUser.lname = user.lname,
//                     currentUser.street = user.street,
//                     currentUser.city = user.city,
//                     currentUser.state = user.state,
//                     currentUser.zip_code = user.zip_code,
//                     currentUser.email = user.email,
//                     currentUser.password = hash,
//                     currentUser.phone = user.phone

//                     currentUser.save((err, user) => {

//                         if(err) return console.log(err);
//                     });
//                     console.log('\n' + currentUser.fname + ' ' + currentUser.lname + "'s password is now: " + hash + '.\n');
//                 });
//             });
//         });
//         let message = 'The deed is done!!';
//         res.send(message);
//    });
// });

module.exports = router;