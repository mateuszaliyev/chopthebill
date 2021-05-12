// .env
require("dotenv").config();

// Config
const { db } = require("../config/db");

// Tokens
const { verifyToken } = require("../utils/jwt");

// Utils
const { distance, closest } = require("fastest-levenshtein");

async function searchService(query, authHeader) {
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return { error: "unauthorized", results: [] };
	}
	const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
	if (decoded) {
		const searchQuery = await db.query(
			`SELECT id_user, email, username, hide_email, deleted FROM public."user"`,
			[]
		);

		let results = [];

		if (searchQuery.rows[0]) {
			const users = searchQuery.rows.map((user) => {
				if (!user.deleted) {
					const includes =
						(user.hide_email
							? false
							: user.email
									.toLowerCase()
									.split("@")[0]
									.includes(query.toLowerCase())) ||
						user.username.toLowerCase().includes(query.toLowerCase());

					let match = user.hide_email
						? distance(query.toLowerCase(), user.username.toLowerCase())
						: distance(
								query.toLowerCase(),
								closest(query.toLowerCase(), [
									user.email.toLowerCase(),
									user.email.toLowerCase().split("@")[0],
									user.username.toLowerCase(),
								])
						  );

					if (includes && match > 1) {
						match = 1;
					}

					return {
						id: user.id_user,
						email: user.hide_email ? "" : user.email,
						username: user.username,
						hideEmail: user.hide_email,
						match: match,
					};
				}
			});

			results = users
				.filter((user) => user.match <= 3)
				.sort((a, b) => {
					return a.match - b.match;
				});
		}

		return { error: "", results };
	}
	return { error: "forbidden", results: [] };
}

module.exports = { searchService };
