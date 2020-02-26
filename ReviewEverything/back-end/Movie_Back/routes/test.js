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
    rating: Number, 
    userId: String, 
    movieId: Number,
    movieTitle: String
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
    phone: String, 
    admin: Boolean
})

const RR = mongoose.model('reviewratings', reviewSchema)

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
    console.log('Review username ' + req.body.username);
    console.log("Review UserId " + req.body.userId);
    RR.findOne({ 'movieTitle': req.body.movieTitle, 'username': req.body.username }, (err, review) => {
        if(!review) {
            var r = new RR({review: req.body.review, rating: req.body.rating, username: req.body.username, movieId: req.body.movieId, movieTitle: req.body.movieTitle , userId: req.body.userId})
            r.save(function(err){
                if(err)
                    throw err;
                else  
                    console.log('saved!')
            })
            res.send({error: false});
        } else {
            res.send({error: true, errorMessage: 'You already have a review of this movie. Check your reviews to edit or delete your current review.'});
        }
    })
});

router.post('/login', function(req, res) {
    console.log('\nChecking data...\n');
    // console.log('Username submitted: ' + req.body.username);
    // console.log('Password submitted(unhashed): ' + req.body.password);
   
    if(req.body.username != null && req.body.password != null) {
        let status = false;
        User.findOne({'username': req.body.username}, function(err, user) {
            if(!user) {
                let statusMessage = 'The USERNAME you entered was incorrect.'
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
                        let passwordFail = true;
                        res.send({status, statusMessage, passwordFail});
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
    let errors = false;
    let error_message = "";
    let name_check = /[a-z]{2,}/i;
    let street_check = /[0-9]+\s[a-z]+/i;
    let zip_check = /^([\d]{5})(\-[\d]{4})?$/;
    let phone_check = /^(1?\([0-9]{3}\)( |)|(1-|1)?[0-9]{3}-?)[0-9]{3}-?[0-9]{4}$/;
    if(!req.body.username) {
        errors = true;
        error_message += "\nThe USERNAME you entered is invalid. A username is required for use on this website.\n";
    }
    if(!name_check.test(req.body.fname) || !req.body.fname) {
        errors = true;
        error_message += "\nThe FIRST NAME you entered is invalid. Are you sure you don't have a first name?\n";
    }
    if(!name_check.test(req.body.lname) || !req.body.lname) {
        errors = true;
        error_message += "\nThe LAST NAME you entered is invalid. Do you have a last name?\n";
    }
    if(!name_check.test(req.body.city) || !req.body.city) {
        errors = true;
        error_message += "\nThe CITY you entered is invalid. A small village counts as a city in our case.\n";
    }
    if(!street_check.test(req.body.street)) {
        errors = true;
        error_message += "\nThe STREET you entered is invalid. Please make sure you entered a street number as well as street name.\n";
    }
    if(!zip_check.test(req.body.zip_code)) {
        errors = true;
        error_message += "\nThe ZIPCODE you entered is invalid. Please input a valid zip code.\n";
    }
    if(!req.body.email) {
        errors = true;
        error_message += "\nThe EMAIL you entered is invalid or doesn't exist. Please enter an email.\n";
    }
    if(!req.body.password) {
        errors = true;
        error_message += "\nThe PASSWORD you entered seems to be empty. We need a password to secure your account.\n";
    }
    if(!phone_check.test(req.body.phone)) {
        errors = true;
        error_message += "\nThe PHONE NUMBER you entered is invalid. Please enter a valid US phone number.\n";;
    }
    if(errors) {
        res.send({ error_check: errors, message: error_message });
    }
    else {
        bcrypt.hash(req.body.password, saltRounds).then((hash) => {
            const newUser = new User({
                username: req.body.username,
                fname: req.body.fname,
                lname: req.body.lname,
                street: req.body.street,
                city: req.body.city,
                state: req.body.state,
                zip_code: req.body.zip_code,
                email: req.body.email,
                password: hash,
                phone: req.body.phone,
                admin: false,
            })
            
            newUser.save((err, user) => {
                if (err) return console.log(err);
                console.log(user.username + ' added!');
            });

            return res.send({error_check: errors, user: newUser})
        });
    }
});

router.put('/editReview', function(req, res) {
    console.log('Saving your review...');
    RR.findById(req.body.reviewId, (err, review) => {
        if(err) return console.log(err)
        review.review = req.body.newReview,
        review.rating = req.body.newRating,

        review.save((err, savedReview) => {
            if(err) return console.log(err)
            console.log('Review updated for ' + savedReview.movieTitle);
            return res.send({ success: true });
        })
    })
})

router.put('/editAccount', function(req, res) {
    console.log("Checking data...");
    console.log(req.body.userId);
    let errors = false;
    let error_message = "";
    let name_check = /[a-z]{2,}/i;
    let street_check = /[0-9]+\s[a-z]+/i;
    let zip_check = /^([\d]{5})(\-[\d]{4})?$/;
    let phone_check = /^(1?\([0-9]{3}\)( |)|(1-|1)?[0-9]{3}-?)[0-9]{3}-?[0-9]{4}$/;
    if(!req.body.username) {
        errors = true;
        error_message += "The USERNAME you entered is invalid. A username is required for use on this website.\n";
    }
    if(!name_check.test(req.body.fname) || !req.body.fname) {
        errors = true;
        error_message += "The FIRST NAME you entered is invalid. Are you sure you don't have a first name?\n";
    }
    if(!name_check.test(req.body.lname) || !req.body.lname) {
        errors = true;
        error_message += "The LAST NAME you entered is invalid. Do you have a last name?\n";
    }
    if(!name_check.test(req.body.city) || !req.body.city) {
        errors = true;
        error_message += "The CITY you entered is invalid. A small village counts as a city in our case.\n";
    }
    if(!street_check.test(req.body.street)) {
        errors = true;
        error_message += "The STREET you entered is invalid. Please make sure you entered a street number as well as street name.\n";
    }
    if(!zip_check.test(req.body.zip_code)) {
        errors = true;
        error_message += "The ZIPCODE you entered is invalid. Please input a valid zip code.\n";
    }
    if(!req.body.email) {
        errors = true;
        error_message += "The EMAIL you entered is invalid or doesn't exist. Please enter an email.\n";
    }
    if(!phone_check.test(req.body.phone)) {
        errors = true;
        error_message += "The PHONE NUMBER you entered is invalid. Please enter a valid US phone number.\n";;
    }
    if(errors) {
        res.send({ error_check: errors, message: error_message });
    }
    else {
        User.findById(req.body.userId, (err, user) => {
            if(err) return console.log(err);
            user.username = req.body.username,
            user.fname = req.body.fname,
            user.lname = req.body.lname,
            user.street = req.body.street,
            user.city = req.body.city,
            user.state = req.body.state,
            user.zip_code = req.body.zip_code,
            user.email = req.body.email,
            user.phone = req.body.phone,
    
            user.save((err, savedUser) => {
                if(err) return console.log(err)
                console.log(savedUser.username + ' updated!');
                return res.send({ error_check: errors, user: savedUser });
            });
        });
    }
});

router.post('/getReviews', (req, res) => {
    console.log(req.body.username);
    RR.find({ "username": req.body.username}, (err, reviews) => {
        if(err) return console.log(err);
        let reviewCollection = [];
        reviews.forEach((review) => {
            console.log(review);
            reviewCollection.push(review);
        })
    res.send(reviewCollection);
    })
});

router.post('/averageReviews', function(req, res) {
    console.log("Movie ID submitted: " + req.body.movieId);
    RR.find({ 'movieId': req.body.movieId }, (err, reviews) => {
        if(err) return console.log(err);
        let n = reviews.length;
        total = 0;
        reviews.forEach((review) => {
            console.log('Rating of current index: ' + review.rating);
            total = total+review.rating;
        })
        console.log('Total: ' + total);
        console.log('Current N: ' + n);
        let average = total/n;

        console.log('Average: ' + average);
        
        res.send({averageRating: average});
    })
})

router.delete('/delUsers', function (req, res) {
    User.findOneAndDelete(req.body.username, function (err, user) {
      console.log(req.body.username)
      if (err) return res.status(500).send("There was a problem deleting the user.");
      res.status(200).send("User: "+" was deleted.");
    //   console.log(req.body.userId)
    });
});

router.delete('/deleteReview', function(req, res) {
    RR.findByIdAndDelete(req.body.reviewId, (err, review) => {
        if (err) return console.log(err);
    })
    res.send({ message: 'Delete completed.' });
})
  
router.get('/addAdmin', (req, res) => {
   User.find((err, users) => {
               if (err) console.log(err);
               users.forEach((user) => {
                   const admin = false; 
                   User.findById(user._id, (err, currentUser) => {
                       if (err) return console.log(err);
                       currentUser.admin = admin,
                       currentUser.username = user.username,
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
                           console.log(user.admin + ' saved!');
                       });
                   });
               });
               let message = 'Users now have admin access.'
               res.send(message);
           });
       });

// router.get('/addusername', (req, res) => {
//     User.find((err, users) => {
//         if (err) console.log(err);
//         users.forEach((user) => {
//             const username = user.fname + user.lname.slice(0,1);
//             User.findById(user._id, (err, currentUser) => {
//                 if (err) return console.log(err);
//                 currentUser.username = username,
//                 currentUser.fname = user.fname,
//                 currentUser.lname = user.lname,
//                 currentUser.street = user.street,
//                 currentUser.city = user.city,
//                 currentUser.state = user.state,
//                 currentUser.zip_code = user.zip_code,
//                 currentUser.email = user.email,
//                 currentUser.password = user.password,
//                 currentUser.phone = user.phone

//                 currentUser.save((err, user) => {
//                     if(err) return console.log(err);
//                     console.log(user.username + ' saved!');
//                 });
//             });
//         });
//         let message = 'Users now have usernames.'
//         res.send(message);
//     });
// });

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
//
//                     currentUser.save((err, user) => {
//
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