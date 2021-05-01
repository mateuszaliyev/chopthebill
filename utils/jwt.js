require("dotenv").config();
const jwt = require("jsonwebtoken");

function getAccessToken(payload) {
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "15m",
	});
}

function getRefreshToken(payload) {
	return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d",
	});
}

function verifyToken(token, secret) {
	try {
		const decoded = jwt.verify(token, secret);
		return true;
	} catch (err) {
		return false;
	}
}

module.exports = {
	getAccessToken,
	getRefreshToken,
	verifyAccessToken: verifyToken,
};
