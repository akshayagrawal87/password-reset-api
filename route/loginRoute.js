//Login logic
//Check if req email is present in db if yes check if password is correct by unhashing it also add a jwt token on login so
//when the page is refreshed it persists and delete token on logout
//1.login(Check db the check password then create jwt use jwt service and hashing service).
//2.logout(delete the stored jwt token from server).

const express = require("express");

var _require = require("../services/jwtService"),
	createToken = _require.createToken,
	validateToken = _require.validateToken;

var _require2 = require("../services/hashingService"),
	generateHash = _require2.generateHash,
	validateHash = _require2.validateHash;

require("dotenv/config");

const url = process.env.DB_CONNECTION;

const loginRouter = express.Router();

const MongoClient = require("mongodb").MongoClient;

const client = new MongoClient(url, { useNewUrlParser: true });

client.connect((err) => {
	const collection = client.db("akshay").collection("user");
	// perform actions on the collection object
	console.log("Connected to db");
	client.close();
});

loginRouter.get("/login", (req, res) => {
	const { jwt } = req.cookies;
	if (validateToken(jwt)) {
		res.send({ message: "Login Sucess!", loggedIn: true });
	} else {
		res.send({ message: "Login Failed!", loggedIn: false });
	}
});

loginRouter.post("/login", (req, res) => {
	const { username, password } = req.body;

	// Connect to mongodb
	MongoClient.connect(process.env.DB_CONNECTION, function (err, db) {
		if (err) throw err;
		const dbo = db.db("url-shortner-users");

		dbo
			.collection("Users")
			// Get the user details
			.findOne({ username }, function (err, result) {
				if (err) throw err;
				if (result !== null) {
					if (result.password && result.username === username) {
						// Validate the hash against plain text password
						validateHash(password, result.password).then((result) => {
							if (result) {
								const token = createToken(username);
								res.cookie("jwt", token, {
									maxAge: 100000000,
									httpOnly: true,
									secure: true, // set to true on heroku
								});
								res
									.status("200")
									.send({ message: "Login Sucess!", loggedIn: true });
							} else {
								res
									.status("401")
									.send({ message: "Login Failure", loggedIn: false });
							}
						});
					} else {
						res
							.status("401")
							.send({ message: "Login Failure!", loggedIn: false });
					}
				} else {
					res
						.status("400")
						.send({ message: "User doesn't exists", loggedIn: false });
				}
			});
	});
});

loginRouter.get("/logout", (req, res) => {
	res.clearCookie("jwt");
	res.send({ message: "user logged out!", loggedIn: false });
});

module.exports = loginRouter;
