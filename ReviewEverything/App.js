const Express = require("express");
const BodyParser = require("body-parser");
const Bcrypt = require("bcryptjs");

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const filter = {};

MongoClient.connect(
  'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false',
  { useNewUrlParser: true, useUnifiedTopology: true },
  function(connectErr, client) {
    assert.equal(null, connectErr);
    const coll = client.db('Users').collection('User_Profiles');
    coll.find(filter, (cmdErr, result) => {
      assert.equal(null, cmdErr);
    });
    client.close();
  });