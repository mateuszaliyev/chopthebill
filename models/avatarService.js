require("dotenv").config();
const fs = require("fs");

const { db } = require("../config/db");

const { verifyToken } = require("../utils/jwt");

async function addAvatarService(authHeader) {
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return "unauthorized";
	}
	const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);

	if (decoded) {
		const idQuery = await db.query(
			`SELECT id_user, deleted FROM public."user" WHERE username = $1 AND deleted = FALSE`,
			[decoded.username]
		);

		if (idQuery.rows[0]) {
			return "";
		}
		return "bad-request";
	}
	return "forbidden";
}

async function deleteAvatarService(authHeader) {
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return "unauthorized";
	}
	const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);

	if (decoded) {
		const idQuery = await db.query(
			`SELECT id_user, deleted FROM public."user" WHERE username = $1 AND deleted = FALSE`,
			[decoded.username]
		);

		if (idQuery.rows[0]) {
			const files = await fs.promises.readdir("public/avatars/");

			for (const file of files) {
				if (file.split(".")[0] === decoded.id) {
					fs.promises.unlink(`public/avatars/${file}`);
					console.log("test");
					return "";
				}
			}
		}
		return "bad-request";
	}
	return "forbidden";
}

module.exports = { addAvatarService, deleteAvatarService };
