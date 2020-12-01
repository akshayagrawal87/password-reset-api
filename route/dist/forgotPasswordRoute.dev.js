"use strict";

var express = require("express");

var randomstring = require("randomstring");

var nodemailer = require("nodemailer");

var url = process.env.DB_CONNECTION;

var MongoClient = require("mongodb").MongoClient;

var sendUrl = "https://password-reset-api.herokuapp.com/forgotPassword/";

var _require2 = require("../services/hashingService"),
    generateHash = _require2.generateHash;

require("dotenv/config");

var forgotPasswordRouter = express.Router();
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.gmailUserName,
    pass: process.env.gmailPassword
  }
});
forgotPasswordRouter.post("/", function (req, res) {
  console.log("Inside forgot password");
  var username = req.body.username;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("url-shortner-users");
    dbo.collection("Users") // Get the user details
    .findOne({
      username: username
    }, function (err, result) {
      if (err) throw err;

      if (result !== null) {
        var randomString = randomstring.generate({
          length: 18,
          charset: "alphanumeric"
        });
        var myquery = {
          username: username
        };
        dbo.collection("ResetPassword").findOne(myquery, function (err, result) {
          if (err) throw err;
          if (result !== null) dbo.collection("ResetPassword").deleteOne(myquery, function (err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            db.close();
          });
          db.close();
        });
        dbo.collection("ResetPassword").createIndex({
          createdAt: 1
        }, {
          expireAfterSeconds: 60
        });
        dbo.collection("ResetPassword").insertOne({
          createdAt: new Date(),
          username: username,
          string: randomString
        }, function (err, res) {
          if (err) throw err;
          console.log("Random string Inserted");
          db.close();
        });
        var mailOptions = {
          from: process.env.gmailUserName,
          to: username,
          subject: "Reset Url Shortner Password.",
          text: "The given link will be expires in 1 min: " + sendUrl + randomString
        };
        transporter.sendMail(mailOptions, function (err, data) {
          if (err) {
            res.send({
              message: "Error Occurs",
              linkSent: false
            });
          } else {
            res.send({
              message: "Link Sent",
              linkSent: true
            });
          }
        });
      } else {
        res.send({
          message: "No user found!!",
          linkSent: false
        });
      }
    });
  });
});
forgotPasswordRouter.get("/:randomString", function (req, res) {
  var randomString = req.params.randomString;
  console.log(randomString);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("url-shortner-users");
    dbo.collection("ResetPassword").findOne({
      string: randomString
    }, function (err, result) {
      if (err) throw err;

      if (result !== null) {
        console.log(result.username);
        res.redirect("https://password-reset-ui.netlify.app/resetPassword.html");
      } else {
        console.log({
          message: "Link Expired",
          reset: false
        });
        res.redirect("https://password-reset-ui.netlify.app/outputPages/invalidLink.html");
      }

      db.close();
    });
  });
});
forgotPasswordRouter.post("/changePassword", function _callee2(req, response) {
  var email, password;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          email = req.body.username;
          password = req.body.password;
          MongoClient.connect(process.env.DB_CONNECTION, function _callee(err, db) {
            var dbo, resetToken, data;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (!err) {
                      _context.next = 2;
                      break;
                    }

                    throw err;

                  case 2:
                    dbo = db.db("url-shortner-users");
                    _context.next = 5;
                    return regeneratorRuntime.awrap(dbo.collection("ResetPassword").findOne({
                      username: email
                    }));

                  case 5:
                    resetToken = _context.sent;

                    if (!(resetToken !== null)) {
                      _context.next = 13;
                      break;
                    }

                    _context.next = 9;
                    return regeneratorRuntime.awrap(dbo.collection("Users") // Get the user details
                    .findOne({
                      username: email
                    }));

                  case 9:
                    data = _context.sent;

                    if (data !== null) {
                      if (data.username === email) {
                        generateHash(password).then(function (passwordHash) {
                          var myobj = {
                            password: passwordHash
                          };
                          var myquery = {
                            username: email
                          };
                          var newvalues = {
                            $set: {
                              password: passwordHash
                            }
                          };
                          dbo.collection("customers").updateOne(myquery, newvalues, function (err, res) {
                            if (err) {
                              response.send({
                                message: "Password  not changed",
                                changed: false
                              });
                            }

                            console.log("New password updated");
                            db.close();
                            response.send({
                              message: "Password changed",
                              changed: true
                            });
                          });
                        })["catch"](console.error("Unable to create password!"));
                      }
                    } else {
                      console.log("user doesn't exists exists");
                      response.send({
                        message: "user doesn't exists",
                        changed: false
                      });
                    }

                    _context.next = 14;
                    break;

                  case 13:
                    response.send({
                      message: "Session Expired! Try Again!!",
                      changed: false
                    });

                  case 14:
                  case "end":
                    return _context.stop();
                }
              }
            });
          });

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
});
module.exports = forgotPasswordRouter;