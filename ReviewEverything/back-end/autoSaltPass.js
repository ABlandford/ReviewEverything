const Express = require("express");
const BodyParser = require("body-parser");
const Mongoose = require("mongoose");

var MongoClient = require('mongodb').MongoClient

var URL = 'mongodb://localhost:27017/Users'

MongoClient.connect(URL, function(err, db) {
  if (err) return

  var collection = db.collection('foods')
  
    collection.find({name: 'taco'}).toArray(function(err, docs) {
      console.log(docs[0])
      db.close()
    })

})