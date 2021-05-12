// .env
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
		return decoded;
	} catch (err) {
		return null;
	}
}

function getResetPasswordLink(payload, secret) {
	const token = jwt.sign(payload, secret, { expiresIn: "15m" });
	return `http://localhost:3000/reset-password/${payload.id}/${token}`;
}

module.exports = {
	getAccessToken,
	getRefreshToken,
	verifyToken,
	getResetPasswordLink,
};
