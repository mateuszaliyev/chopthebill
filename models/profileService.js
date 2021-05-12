// .env
require("dotenv").config();

// Config
const { db } = require("../config/db");

// Utils
const { verifyToken } = require("../utils/jwt");

async function profileService(id, authHeader) {
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return { error: "unauthorized", user: {} };
	}

	const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);

	if (decoded) {
		const profileQuery = await db.query(
			`SELECT id_user, email, username, language, theme, hide_email, last_seen, deleted FROM public."user" WHERE id_user = $1`,
			[id]
		);
		if (profileQuery.rows[0] && !profileQuery.rows[0].deleted) {
			const user = {
				id: profileQuery.rows[0].id_user,
				email: profileQuery.rows[0].email,
				username: profileQuery.rows[0].username,
				language: profileQuery.rows[0].language,
				theme: profileQuery.rows[0].theme,
				hideEmail: profileQuery.rows[0].hide_email,
				lastSeen: profileQuery.rows[0].last_seen,
			};
			return { error: "", user };
		}
	}

	return { error: "forbidden", user: {} };
}
module.exports = { profileService };
