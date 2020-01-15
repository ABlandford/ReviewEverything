var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/Users/User_Profiles";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("Users");
  var f = dbo.collection("fname").findOne({'fname' : 'Bob'}
//     if (err) throw err;
//     console.log(result);
//     console.log("BRUH")
//     db.close();
//   });
 );
 console.log(f)
})

// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//   var dbo = db.db("Users");
//   dbo.collection('fname').findOne({"fname":'Bob'})
//     .then(function(result) {
//       console.log(result); // Use this to debug
//       callback(result);
//     })
// });



router.get('/', function(req, res, next) {
    res.send('FHjdsfshjfhjds'); 
});

module.exports = MongoClient; 