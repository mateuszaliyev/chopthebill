// .env
require("dotenv").config();

// Config
const { db } = require("../config/db");

// Utils
const { verifyToken } = require("../utils/jwt");
const { settingsValidate } = require("../utils/validate");

async function profileService(id, authHeader) {
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return { error: "unauthorized", user: {} };
	}

	const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);

	if (decoded) {
		const idQuery = await db.query(
			`SELECT id_user, deleted FROM public."user" WHERE username = $1`,
			[decoded.username]
		);

		const profileQuery = await db.query(
			`SELECT id_user, email, username, language, theme, hide_email, last_seen, deleted FROM public."user" WHERE id_user = $1`,
			[id]
		);
		if (
			profileQuery.rows[0] &&
			!profileQuery.rows[0].deleted &&
			idQuery.rows[0] &&
			!idQuery.rows[0].deleted
		) {
			const checkQuery = await db.query(
				`SELECT * FROM public."friendship" WHERE id_user_1 = $1 AND id_user_2 = $2`,
				[idQuery.rows[0].id_user, id]
			);
			let friend = false;
			if (checkQuery.rows[0] && checkQuery.rows[0].valid) {
				friend = true;
			}
			const user = {
				id: profileQuery.rows[0].id_user,
				email: profileQuery.rows[0].email,
				username: profileQuery.rows[0].username,
				language: profileQuery.rows[0].language,
				theme: profileQuery.rows[0].theme,
				hideEmail: profileQuery.rows[0].hide_email,
				lastSeen: profileQuery.rows[0].last_seen,
				friend,
			};
			return { error: "", user };
		}
	}

	return { error: "forbidden", user: {} };
}

async function settingsService(authHeader, settings) {
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return { error: "unauthorized", user: {} };
	}

	const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);

	if (decoded) {
		const issues = settingsValidate(settings);

		const emailQuery = await db.query(
			`SELECT email, username FROM public."user" WHERE email = $1`,
			[settings.email]
		);

		if (
			emailQuery.rows[0] &&
			emailQuery.rows[0].username !== decoded.username
		) {
			issues.push("email-taken");
		}

		const usernameQuery = await db.query(
			`SELECT username FROM public."user" WHERE username = $1`,
			[settings.username]
		);

		if (
			usernameQuery.rows[0] &&
			usernameQuery.rows[0].username !== decoded.username
		) {
			issues.push("username-taken");
		}

		if (issues.length > 0) {
			return issues;
		}

		await db.query(
			`UPDATE public."user" SET email=$1, username=$2, language=$3, theme=$4, hide_email=$5, last_seen=NOW() WHERE username = $6`,
			[
				settings.email,
				settings.username || settings.email,
				settings.language,
				settings.theme,
				settings.hideEmail,
				decoded.username,
			]
		);
		return [];
	}
}
module.exports = { profileService, settingsService };
