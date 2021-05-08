require("dotenv").config();
const { db } = require("../config/db");
const { verifyToken } = require("../utils/jwt");

async function searchService(query, authHeader) {
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return { error: "unauthorized", result: [] };
	}
	const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
	if (decoded) {
		const searchQuery = await db.query(
			`SELECT id_user, email, username, deleted FROM public."user" WHERE email = $1 OR username = $1;`,
			[query]
		);
		if (searchQuery.rows[0]) {
			const result = searchQuery.rows.filter((user) => !user.deleted);
			return { error: "", result };
		}
	}
	return { error: "forbidden", result: [] };
}

module.exports = { searchService };
