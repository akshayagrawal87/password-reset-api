const express = require("express");

const registerRouter = express.Router();

const MongoClient = require("mongodb").MongoClient;

var _require2 = require("../services/hashingService"),
	generateHash = _require2.generateHash,
	validateHash = _require2.validateHash;

const createUser = (email, password) => {};

registerRouter.post("/", async (req, response) => {
	const email = req.body.username;
	const password = req.body.password;

	MongoClient.connect(process.env.DB_CONNECTION, async function (err, db) {
		if (err) throw err;
		var dbo = db.db("url-shortner-users");

		let data = await dbo
			.collection("Users") // Get the user details
			.findOne({
				username: email,
			});

		if (data === null || data.username !== email) {
			generateHash(password)
				.then(function (passwordHash) {
					var myobj = {
						username: email,
						password: passwordHash,
					};
					dbo.collection("Users").insertOne(myobj, function (err, res) {
						if (err) throw err;
						console.log("User password Inserted");
						db.close();
						response.send({ message: "user created", created: true });
					});
				})
				.catch(console.error("Unable to create password!"));
		} else {
			console.log("user alreay exists");
			response.send({ message: "user already exists", created: false });
		}
	});
});

module.exports = registerRouter;
