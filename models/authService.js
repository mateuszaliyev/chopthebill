// .env
require("dotenv").config();

// Bcrypt
const bcrypt = require("bcrypt");

// Config
const { db } = require("../config/db");

// Validation
const {
	registerValidate,
	loginValidate,
	passwordValidate,
} = require("../utils/validate");

// Tokens
const {
	getAccessToken,
	getRefreshToken,
	verifyToken,
	getToken,
} = require("../utils/jwt");

async function registerService(user) {
	const issues = registerValidate(user);

	const emailQuery = await db.query(
		`SELECT email FROM public."user" WHERE email = $1`,
		[user.email]
	);

	if (emailQuery.rows[0]) {
		issues.push("email-taken");
	}

	const usernameQuery = await db.query(
		`SELECT username FROM public."user" WHERE username = $1`,
		[user.username]
	);

	if (usernameQuery.rows[0]) {
		issues.push("username-taken");
	}

	if (issues.length > 0) {
		return issues;
	}

	const hashedPassword = await bcrypt.hash(user.password, 10);

	await db.query(
		`INSERT INTO public."user"(id_user, email, password, username, language, theme, avatar, hide_email, last_seen, deleted) 
			VALUES (default, $1, $2, $3, $4, $5, FALSE, $6, NOW(), FALSE)`,
		[
			user.email,
			hashedPassword,
			user.username || user.email,
			user.language,
			user.theme,
			user.hideEmail,
		]
	);
	return [];
}

async function loginService(email, password) {
	if (!loginValidate(email, password)) {
		return { accessToken: "", refreshToken: "", error: "login-data-invalid" };
	}

	const userQuery = await db.query(
		`SELECT id_user, email, password, username, language, theme, avatar, hide_email, last_seen FROM public."user" WHERE email = $1 AND deleted = FALSE`,
		[email]
	);
	if (
		!userQuery.rows[0] ||
		!(await bcrypt.compare(password, userQuery.rows[0]?.password))
	) {
		return {
			accessToken: "",
			refreshToken: "",
			user: {},
			error: "login-data-invalid",
		};
	}

	const accessToken = getAccessToken({
		id: userQuery.rows[0].id_user,
		username: userQuery.rows[0].username,
	});
	const refreshToken = getRefreshToken({
		id: userQuery.rows[0].id_user,
		username: userQuery.rows[0].username,
	});
	const user = {
		id: userQuery.rows[0].id_user,
		email: userQuery.rows[0].email,
		username: userQuery.rows[0].username,
		language: userQuery.rows[0].language,
		theme: userQuery.rows[0].theme,
		hideEmail: userQuery.rows[0].hide_email,
		lastSeen: userQuery.rows[0].last_seen,
	};

	await db.query(
		`UPDATE public."user" SET last_seen = NOW(), refresh_token = $1 WHERE email = $2`,
		[refreshToken, email]
	);
	return { accessToken, refreshToken, user, error: "" };
}

async function accessService(decoded) {
	const userQuery = await db.query(
		`SELECT id_user, email, username, language, theme, avatar, hide_email, last_seen FROM public."user" WHERE id_user = $1 AND deleted = FALSE`,
		[decoded.id]
	);
	if (userQuery.rows[0]) {
		const user = {
			id: userQuery.rows[0].id_user,
			email: userQuery.rows[0].email,
			username: userQuery.rows[0].username,
			language: userQuery.rows[0].language,
			theme: userQuery.rows[0].theme,
			avatar: userQuery.rows[0].avatar,
			hideEmail: userQuery.rows[0].hide_email,
			lastSeen: userQuery.rows[0].last_seen,
		};
		await db.query(
			`UPDATE public."user" SET last_seen = NOW() WHERE id_user = $1`,
			[decoded.id]
		);
		return user;
	}
	return null;
}

async function refreshService(authHeader) {
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return "unauthorized";
	}
	if (verifyToken(token, process.env.REFRESH_TOKEN_SECRET)) {
		const refreshQuery = await db.query(
			`SELECT username, id_user FROM public."user" WHERE refresh_token = $1 AND deleted = FALSE`,
			[token]
		);
		if (refreshQuery.rows[0]) {
			return getAccessToken({
				id: refreshQuery.rows[0].id_user,
				username: refreshQuery.rows[0].username,
			});
		}
	}
	return "forbidden";
}

async function logoutService(decoded) {
	await db.query(
		`UPDATE public."user" SET refresh_token = NULL WHERE id_user = $1`,
		[decoded.id]
	);
}

async function forgotPasswordService(email) {
	const emailPasswordIdLanguageQuery = await db.query(
		`SELECT password, id_user, language FROM public."user" WHERE email = $1`,
		[email]
	);

	if (!emailPasswordIdLanguageQuery.rows[0]) {
		return { link: "", error: "invalid-email" };
	}

	const {
		password,
		id_user: id,
		language,
	} = emailPasswordIdLanguageQuery.rows[0];

	const secret = process.env.ACCESS_TOKEN_SECRET + password;

	const payload = {
		email,
		id,
	};

	const token = getToken(payload, secret);
	const link = `http://localhost:3000/${language}/reset-password/${id}/${token}`;

	return { link: link, error: "" };
}

async function validateLinkService(id, token) {
	const idPasswordQuery = await db.query(
		`SELECT id_user, password FROM public."user" WHERE id_user = $1`,
		[id]
	);

	if (!idPasswordQuery.rows[0]) {
		return "invalid-link";
	}

	const secret =
		process.env.ACCESS_TOKEN_SECRET + idPasswordQuery.rows[0].password;

	if (!verifyToken(token, secret)) {
		return "link-expired";
	}

	return "";
}

async function resetPasswordService(id, token, password) {
	const idPasswordQuery = await db.query(
		`SELECT id_user, password FROM public."user" WHERE id_user = $1`,
		[id]
	);

	if (!idPasswordQuery.rows[0]) {
		return "invalid-link";
	}

	const secret =
		process.env.ACCESS_TOKEN_SECRET + idPasswordQuery.rows[0].password;

	if (!verifyToken(token, secret)) {
		return "link-expired";
	}

	if (!passwordValidate(password)) {
		return "invalid-password";
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	await db.query(`UPDATE public."user" SET password = $1 WHERE id_user = $2`, [
		hashedPassword,
		id,
	]);

	return "";
}

module.exports = {
	registerService,
	loginService,
	accessService,
	refreshService,
	logoutService,
	forgotPasswordService,
	validateLinkService,
	resetPasswordService,
};
