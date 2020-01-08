const Express = require("express");
const BodyParser = require("body-parser");
const Mongoose = require("mongoose");
const Bcrypt = require("bcryptjs");

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extend: true })); 



