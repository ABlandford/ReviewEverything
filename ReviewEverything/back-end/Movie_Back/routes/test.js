
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("Users");
  dbo.collection("fname").findOne({}, function(err, result) {
    if (err) throw err;
    console.log(result.name);
    console.log("BRUH")
    db.close();
  });
});

router.get('/', function(req, res, next) {
    res.send('API is working properly');
});

module.exports = router;