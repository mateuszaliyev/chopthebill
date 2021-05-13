// .env
require("dotenv").config();

// Config
const { db } = require("../config/db");

// Tokens
const { verifyToken } = require("../utils/jwt");

async function addFriendService(authHeader, id) {
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return "unauthorized";
	}
	const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
	if (decoded) {
		const idQuery1 = await db.query(
			`SELECT id_user, deleted FROM public."user" WHERE username = $1`,
			[decoded.username]
		);
		const idQuery2 = await db.query(
			`SELECT id_user, deleted FROM public."user" WHERE id_user = $1`,
			[id]
		);
		if (
			idQuery1.rows[0] &&
			!idQuery1.rows[0].deleted &&
			idQuery2.rows[0] &&
			!idQuery2.rows[0].deleted
		) {
			const checkQuery = await db.query(
				`SELECT * FROM public."friendship" WHERE id_user_1 = $1 AND id_user_2 = $2`,
				[idQuery1.rows[0].id_user, id]
			);

			if (checkQuery.rows[0]) {
				await db.query(
					`UPDATE public."friendship" SET valid = TRUE WHERE id_friendship = $1`,
					[checkQuery.rows[0].id_friendship]
				);
			} else {
				await db.query(
					`INSERT INTO public."friendship" VALUES (DEFAULT, TRUE, $1, $2)`,
					[idQuery1.rows[0].id_user, id]
				);
			}
			return "";
		}
		return "bad-request";
	}
	return "forbidden";
}

async function unfriendService(authHeader, id) {
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return "unauthorized";
	}
	const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
	if (decoded) {
		const idQuery1 = await db.query(
			`SELECT id_user, deleted FROM public."user" WHERE username = $1`,
			[decoded.username]
		);
		const idQuery2 = await db.query(
			`SELECT id_user, deleted FROM public."user" WHERE id_user = $1`,
			[id]
		);
		if (
			idQuery1.rows[0] &&
			!idQuery1.rows[0].deleted &&
			idQuery2.rows[0] &&
			!idQuery2.rows[0].deleted
		) {
			const checkQuery = await db.query(
				`SELECT * FROM public."friendship" WHERE id_user_1 = $1 AND id_user_2 = $2`,
				[idQuery1.rows[0].id_user, id]
			);

			if (checkQuery.rows[0]) {
				await db.query(
					`UPDATE public."friendship" SET valid = FALSE WHERE id_friendship = $1`,
					[checkQuery.rows[0].id_friendship]
				);
			}

			return "";
		}
		return "bad-request";
	}
	return "forbidden";
}

async function friendsService(authHeader) {
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return { error: "unauthorized", friends: [] };
	}
	const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
	if (decoded) {
		const idQuery = await db.query(
			`SELECT id_user, deleted FROM public."user" WHERE username = $1`,
			[decoded.username]
		);
		if (idQuery.rows[0] && !idQuery.rows[0].deleted) {
			const friendsQuery = await db.query(
				`SELECT u.id_user, u.email, u.username, u.hide_email, u.last_seen, u.deleted FROM public."user" AS u, public."friendship" AS f WHERE u.id_user = f.id_user_2 AND f.id_user_1 = $1 AND f.valid = TRUE AND u.deleted = FALSE ORDER BY last_seen DESC`,
				[idQuery.rows[0].id_user]
			);
			const friends = friendsQuery.rows.map((friend) => ({
				id: friend.id_user,
				email: friend.hide_email ? "" : friend.email,
				username: friend.username,
				hideEmail: friend.hide_email,
				lastSeen: friend.last_seen,
			}));
			return { error: "", friends };
		}

		return { error: "bad-request", friends: [] };
	}
	return { error: "forbidden", friends: [] };
}

module.exports = { addFriendService, unfriendService, friendsService };
