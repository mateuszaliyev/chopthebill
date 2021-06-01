// .env
require("dotenv").config();
const bcrypt = require("bcrypt");

// Config
const { db } = require("../config/db");

// Utils
const { settingsValidate, passwordValidate } = require("../utils/validate");

async function profileService(decoded, id) {
	const profileQuery = await db.query(
		`SELECT id_user, email, username, language, theme, avatar, hide_email, last_seen, deleted FROM public."user" WHERE id_user = $1 AND deleted = FALSE`,
		[id]
	);
	if (profileQuery.rows[0]) {
		const checkQuery = await db.query(
			`SELECT * FROM public."friendship" WHERE id_user_1 = $1 AND id_user_2 = $2`,
			[decoded.id, id]
		);
		const friend = checkQuery.rows[0] && checkQuery.rows[0].valid;
		const user = {
			id: profileQuery.rows[0].id_user,
			email: profileQuery.rows[0].email,
			username: profileQuery.rows[0].username,
			language: profileQuery.rows[0].language,
			theme: profileQuery.rows[0].theme,
			avatar: profileQuery.rows[0].avatar,
			hideEmail: profileQuery.rows[0].hide_email,
			lastSeen: profileQuery.rows[0].last_seen,
			friend,
		};
		return user;
	}
	return null;
}

async function settingsService(decoded, settings) {
	const issues = settingsValidate(settings);

	const emailQuery = await db.query(
		`SELECT email, username FROM public."user" WHERE email = $1 AND deleted = FALSE`,
		[settings.email]
	);

	if (emailQuery.rows[0] && emailQuery.rows[0].username !== decoded.username) {
		issues.push("email-taken");
	}

	const usernameQuery = await db.query(
		`SELECT username FROM public."user" WHERE username = $1 AND deleted = FALSE`,
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
		`UPDATE public."user" SET email=$1, username=$2, language=$3, theme=$4, hide_email=$5, last_seen=NOW() WHERE id_user = $6`,
		[
			settings.email,
			settings.username || settings.email,
			settings.language,
			settings.theme,
			settings.hideEmail,
			decoded.id,
		]
	);
	return issues;
}

async function passwordService(decoded, data) {
	const issues = [];

	if (!passwordValidate(data.newPassword)) issues.push("password-invalid");

	if (data.newPassword !== data.newPasswordConfirm) {
		issues.push("passwords-do-not-match");
	}

	const passwordQuery = await db.query(
		`SELECT password FROM public."user" WHERE id_user = $1 AND deleted = FALSE`,
		[decoded.id]
	);

	if (
		!passwordQuery.rows[0] ||
		!(await bcrypt.compare(data.password, passwordQuery.rows[0].password))
	)
		issues.push("wrong-password");

	if (issues.length > 0) {
		return issues;
	}

	await db.query(`UPDATE public."user" SET password=$1 WHERE id_user = $2`, [
		await bcrypt.hash(data.newPassword, 10),
		decoded.id,
	]);

	return issues;
}

async function deleteService(decoded, password) {
	const passwordQuery = await db.query(
		`SELECT password FROM public."user" WHERE id_user = $1 AND deleted = FALSE`,
		[decoded.id]
	);

	if (
		!passwordQuery.rows[0] ||
		!(await bcrypt.compare(password, passwordQuery.rows[0].password))
	)
		return "wrong-password";

	await db.query(`UPDATE public."user" SET deleted = TRUE WHERE id_user = $1`, [
		decoded.id,
	]);

	return null;
}

module.exports = {
	profileService,
	settingsService,
	passwordService,
	deleteService,
};
