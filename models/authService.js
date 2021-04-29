const bcrypt = require("bcrypt");

// Config
const { db } = require("../config/db");

// Validation
const { registerValidate, loginValidate } = require("../utils/authValidate");

// Tokens
const {
	getAccessToken,
	getRefreshToken,
	verifyAccessToken,
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

	const userQuery = await db.query(
		`INSERT INTO public."user"(id_user, email, password, username, language, theme, hide_email, last_seen) 
			VALUES (default, $1, $2, $3, $4, $5, $6, NOW())`,
		[
			user.email,
			hashedPassword,
			user.username,
			user.language,
			user.theme,
			user.hideEmail,
		]
	);
	return [];
}

async function loginService({ email, password }) {
	if (!loginValidate({ email, password })) {
		return { accessToken: "", refreshToken: "", error: "login-data-invalid" };
	}

	const userQuery = await db.query(
		`SELECT email, password, username FROM public."user" WHERE email = $1`,
		[email]
	);
	if (
		!userQuery.rows[0] ||
		!(await bcrypt.compare(password, userQuery.rows[0]?.password))
	) {
		return { accessToken: "", refreshToken: "", error: "login-data-invalid" };
	}

	const accessToken = getAccessToken({ username: userQuery.rows[0].username });
	const refreshToken = getRefreshToken({
		username: userQuery.rows[0].username,
	});

	const tokenQuery = await db.query(
		`UPDATE public."user" SET refresh_token = $1 WHERE email = $2`,
		[refreshToken, email]
	);
	return { accessToken, refreshToken, error: "" };
}

function accessService(authHeader) {
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return "unauthorized";
	}
	if (verifyAccessToken(token)) {
		return "";
	}
	return "forbidden";
}

module.exports = { registerService, loginService, accessService };
