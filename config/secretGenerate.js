const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

fs.readFile(path.join(__dirname, "../.env"), "utf8", (err, data) => {
	if (err) {
		return console.error(err);
	}
	const rows = data.split("\r\n");
	const env = {};
	rows.forEach((row) => {
		const key = row.split("=")[0];
		const value = row.split("=")[1];
		if (key && key !== "") {
			env[key] = value;
		}
	});
	env.ACCESS_TOKEN_SECRET = crypto.randomBytes(32).toString("hex");
	env.REFRESH_TOKEN_SECRET = crypto.randomBytes(32).toString("hex");
	let newData = "";
	for (key in env) {
		newData += `${key}=${env[key]}\r\n`;
	}
	fs.writeFile(path.join(__dirname, "../.env"), newData, "utf8", (err) => {
		if (err) {
			return console.error(err);
		}
		console.log("JWT secret keys generated");
	});
});
