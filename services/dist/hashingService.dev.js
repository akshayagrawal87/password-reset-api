"use strict";

var bcrypt = require("bcryptjs");

var saltRounds = 10;

exports.generateHash = function (plainTextPassword) {
  return new Promise(function (resolve, reject) {
    bcrypt.hash(plainTextPassword, saltRounds).then(function (hash) {
      resolve(hash);
    })["catch"](reject);
  });
};

exports.validateHash = function (plainTextPassword, passwordHash) {
  return new Promise(function (resolve, reject) {
    bcrypt.compare(plainTextPassword, passwordHash).then(function (result) {
      resolve(result);
    })["catch"](reject);
  });
}; // const plainPassword = "password";
// generateHash(plainPassword).then((hash) => {
// 	console.log("Generated Hash: ", hash);
// 	validateHash(plainPassword, hash).then((result) => {
// 		console.log("Is Valid?");
// 	});
// });