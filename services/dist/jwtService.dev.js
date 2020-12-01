"use strict";

var jwt = require("jsonwebtoken");

require("dotenv/config");

var secret = process.env.JWT_SECRET;

exports.createToken = function (username) {
  return jwt.sign({
    expiresIn: "1h",
    username: username
  }, secret);
};

exports.validateToken = function (token) {
  try {
    var decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    console.error(err);
    return false;
  }
};