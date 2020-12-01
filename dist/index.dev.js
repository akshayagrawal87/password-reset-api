"use strict";

//login,sign up,forgot password,set jwt,jwt verification,mongo connection,node mail setup
//Encrpty password while registration
//Decrypt password while login
//Reset password after string verficiation from mail.
var loginRouter = require("./route/loginRoute");

var registerRouter = require("./route/registerRoute");

var forgotPasswordRouter = require("./route/forgotPasswordRoute");

var express = require("express");

var cors = require("cors");

var app = express();

var bodyParser = require("body-parser");

var cookieParser = require("cookie-parser");

var port = process.env.PORT || 8000;

require("dotenv/config");

app.use(cookieParser()).use(cors()).use(express["static"]("public")).use(bodyParser.json()).use(bodyParser.urlencoded({
  extended: true
}));
app.use("/", loginRouter);
app.use("/register", registerRouter);
app.use("/forgotPassword", forgotPasswordRouter);
app.get("/", function (req, res) {
  res.send("We are using password-reset-api");
});
app.listen(port);