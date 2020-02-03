const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Peeps');

let mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', (callback) => {
});

const reviewSchema = mongoose.Schema({
    rating: Number,
    review: String,
    userfname: String, 
    userlname: String, 
    user_id: String
})

const peopleSchema = mongoose.Schema({
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

const Review = mongoose.model('reviewratings', reviewSchema)

const User2 = mongoose.model('users', peopleSchema)
    
router.get('/', function(req, res) {
    User2.find((err, users) => {
        if (err) console.log(err);
        let userCollection = {};
        users.forEach((user) => {
            console.log('WE ARE HERE!!!')
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
    var r = new Review({ user_id: req.body.userId, userfname: req.body.userfname, userlname: req.body.userlname, review: req.body.review, rating: req.body.rating})
    r.save(function(err){
        if(err)
            throw err;
        else  
            console.log(r.userfname + "'s review saved!");
    })
});

router.post('/login', function(req, res) {
    console.log('\nChecking data...\n');
    console.log('Email submitted: ' + req.body.email);
    console.log('Password submitted(unhashed): ' + req.body.password);
    console.log(req.body.message)
   
    if(req.body.email != null && req.body.password != null) {
        let status = false;
        User2.findOne({'email': req.body.email}, function(err, user) {
            if(!user) {
                let statusMessage = 'The EMAIL you entered was incorrect.'
                res.send({status, statusMessage});
            }
            else if(user) {
                bcrypt.hash(req.body.password, saltRounds).then((hash) => {
                    console.log("\nHashed password: " + hash + ".\n");
                })
                bcrypt.compare(req.body.password, User2.password).then((res2) => {
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

// const User = mongoose.model('User_Profiles', userSchema);

// router.get('/', function(req, res) {
// //     console.log('WE ARE HERE!!!')
//     User.find((err, User_Profiles) => {
//         console.log("BRUH")
//         console.log(User_Profiles.city)
//         if (err) console.log(err);
//         let userCollection = {};
  
//           User_Profiles.forEach((user) => {
//               console.log(user);
//            userCollection[user._id] = user;
//           });
          
//       res.send(userCollection);
        
//     });
//  });

module.exports = router;