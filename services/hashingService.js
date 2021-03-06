const bcrypt = require("bcryptjs");

const saltRounds = 10;

exports.generateHash = (plainTextPassword) => {
	return new Promise((resolve, reject) => {
		bcrypt
			.hash(plainTextPassword, saltRounds)
			.then(function (hash) {
				resolve(hash);
			})
			.catch(reject);
	});
};

exports.validateHash = (plainTextPassword, passwordHash) => {
	return new Promise((resolve, reject) => {
		bcrypt
			.compare(plainTextPassword, passwordHash)
			.then(function (result) {
				resolve(result);
			})
			.catch(reject);
	});
};

// const plainPassword = "password";

// generateHash(plainPassword).then((hash) => {
// 	console.log("Generated Hash: ", hash);

// 	validateHash(plainPassword, hash).then((result) => {
// 		console.log("Is Valid?");
// 	});
// });
