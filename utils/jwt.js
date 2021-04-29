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

function verifyAccessToken(token) {
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		if (err) {
			return false;
		}
		return true;
	});
}

module.exports = { getAccessToken, getRefreshToken, verifyAccessToken };
