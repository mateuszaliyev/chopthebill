// Config
const { db } = require("../config/db");

async function addFriendService(decoded, id) {
	const idQuery = await db.query(
		`SELECT id_user FROM public."user" WHERE id_user = $1 AND deleted = FALSE`,
		[id]
	);
	if (idQuery.rows[0] && idQuery.rows[0] !== decoded.id) {
		const checkQuery = await db.query(
			`SELECT * FROM public."friendship" WHERE id_user_1 = $1 AND id_user_2 = $2`,
			[decoded.id, id]
		);

		if (checkQuery.rows[0]) {
			await db.query(
				`UPDATE public."friendship" SET valid = TRUE WHERE id_friendship = $1`,
				[checkQuery.rows[0].id_friendship]
			);
		} else {
			await db.query(
				`INSERT INTO public."friendship" VALUES (DEFAULT, TRUE, $1, $2)`,
				[decoded.id, id]
			);
		}
		return false;
	}
	return true;
}

async function unfriendService(decoded, id) {
	const idQuery1 = await db.query(
		`SELECT id_user FROM public."user" WHERE id_user = $1 AND deleted = FALSE`,
		[decoded.id]
	);
	const idQuery2 = await db.query(
		`SELECT id_user FROM public."user" WHERE id_user = $1 AND deleted = FALSE`,
		[id]
	);
	if (idQuery1.rows[0] && idQuery2.rows[0]) {
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

		return false;
	}
	return true;
}

async function friendsService(decoded) {
	const idQuery = await db.query(
		`SELECT id_user FROM public."user" WHERE id_user = $1 AND deleted = FALSE`,
		[decoded.id]
	);
	if (idQuery.rows[0]) {
		const friendsQuery = await db.query(
			`SELECT u.id_user, u.email, u.username, u.avatar, u.hide_email, u.last_seen, u.deleted FROM public."user" AS u, public."friendship" AS f WHERE u.id_user = f.id_user_2 AND f.id_user_1 = $1 AND f.valid = TRUE AND u.deleted = FALSE ORDER BY last_seen DESC`,
			[idQuery.rows[0].id_user]
		);
		const friends = friendsQuery.rows.map((friend) => ({
			id: friend.id_user,
			email: friend.hide_email ? "" : friend.email,
			username: friend.username,
			avatar: friend.avatar,
			hideEmail: friend.hide_email,
			lastSeen: friend.last_seen,
		}));
		return friends;
	}

	return null;
}

module.exports = { addFriendService, unfriendService, friendsService };
