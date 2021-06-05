// Environmental variables
require("dotenv").config();

// JWT
const { verifyToken } = require("../utils/jwt");

function authenticate(req, res, next) {
	try {
		const token =
			req.headers.authorization && req.headers.authorization.split(" ")[1];
		if (!token) {
			return res.sendStatus(401);
		}
		const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
		if (decoded) {
			res.locals.decoded = decoded;
			next();
		} else {
			return res.sendStatus(403);
		}
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

module.exports = { authenticate };
