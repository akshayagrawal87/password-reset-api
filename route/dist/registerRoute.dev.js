"use strict";

var express = require("express");

var registerRouter = express.Router();

var MongoClient = require("mongodb").MongoClient;

var _require2 = require("../services/hashingService"),
    generateHash = _require2.generateHash,
    validateHash = _require2.validateHash;

var createUser = function createUser(email, password) {};

registerRouter.post("/", function _callee2(req, response) {
  var email, password;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          email = req.body.username;
          password = req.body.password;
          MongoClient.connect(process.env.DB_CONNECTION, function _callee(err, db) {
            var dbo, data;
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
                    return regeneratorRuntime.awrap(dbo.collection("Users") // Get the user details
                    .findOne({
                      username: email
                    }));

                  case 5:
                    data = _context.sent;

                    if (data === null || data.username !== email) {
                      generateHash(password).then(function (passwordHash) {
                        var myobj = {
                          username: email,
                          password: passwordHash
                        };
                        dbo.collection("Users").insertOne(myobj, function (err, res) {
                          if (err) throw err;
                          console.log("User password Inserted");
                          db.close();
                          response.send({
                            message: "user created",
                            created: true
                          });
                        });
                      })["catch"](console.error("Unable to create password!"));
                    } else {
                      console.log("user alreay exists");
                      response.send({
                        message: "user already exists",
                        created: false
                      });
                    }

                  case 7:
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
module.exports = registerRouter;