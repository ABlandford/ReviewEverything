const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/data');

let mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', (callback) => {

});

const reviewSchema = mongoose.Schema({
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

// const Review = mongoose.model('reviews', reviewSchema)

// const User = mongoose.model('users', userSchema);

// router.get('/', function(req, res) {
//     console.log('WE ARE HERE!!!')
//     User.find((err, users) => {
//         if (err) console.log(err);
        
//         let userCollection = {};

//         users.forEach((user) => {
//             console.log(user);
//             userCollection[user._id] = user;
//         });
        
//         res.send(userCollection);
//     });
// });

module.exports = MongoClient; 