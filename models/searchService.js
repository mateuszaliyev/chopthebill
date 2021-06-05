// Config
const { db } = require("../config/db");

// Utils
const { closest, distance } = require("fastest-levenshtein");

async function searchService(query) {
	const searchQuery = await db.query(
		`SELECT id_user, email, username, avatar, hide_email, last_seen FROM public."user" WHERE deleted = FALSE`,
		[]
	);

	let results = [];

	if (searchQuery.rows[0]) {
		const users = searchQuery.rows.map((user) => {
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
				avatar: user.avatar,
				hideEmail: user.hide_email,
				lastSeen: user.last_seen,
				match: match,
			};
		});

		results = {
			users: users
				.filter((user) => user.match <= 3)
				.sort((a, b) => {
					return a.match - b.match;
				}),
		};
	}

	return results;
}

module.exports = { searchService };
