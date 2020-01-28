const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Users');

let mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', (callback) => {

});

const reviewSchema = mongoose.Schema({
    user_id: String,
    username: String,
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

// const RR = mongoose.model('reviewratings', reviewSchema)

const User = mongoose.model('User_Profiles', userSchema);

// router.get('/', function(req, res) {
//     console.log('WE ARE HERE!!!')
//     User.find((err, User_Profiles) => {
//         // console.log("BRUH")
//         // console.log(User_Profiles.city)
//         if (err) console.log(err);
//         let userCollection = {};

//         User_Profiles.forEach((user) => {
//             console.log(user);
//          userCollection[user._id] = user;
//         });
      
//     res.send(userCollection);
    
//    });
// });

router.post('/login', function(req, res) {
    // if(req.body.email != null && req.body.password != null) {
    //     status = true
    // } else {
    //     status = false
    // }
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
        res.send(status);
    }
});

router.get('/hash', (req, res) => {
    console.log(req.body.message)
    User.find((err, User_Profiles) => {
        if (err) console.log(err);
        User_Profiles.forEach((user) => {
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
                    currentUser.save((err, user) => {
                        if(err) return console.log(err);
                        console.log('\n' + user.fname + ' ' + user.lname + "'s password is now: " + hash + '.\n');
                    });
                });
            });
        });
        let message = 'The deed is done.';
        res.send(message);
   });
});

module.exports = router;