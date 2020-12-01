const jwt = require("jsonwebtoken");

require("dotenv/config");

const secret = process.env.JWT_SECRET;

exports.createToken = (username) => {
	return jwt.sign(
		{
			expiresIn: "1h",
			username,
		},
		secret
	);
};

exports.validateToken = (token) => {
	try {
		const decoded = jwt.verify(token, secret);
		return decoded;
	} catch (err) {
		console.error(err);
		return false;
	}
};
