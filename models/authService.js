require("dotenv").config();

const bcrypt = require("bcrypt");

// Config
const { db } = require("../config/db");

// Validation
const { registerValidate, loginValidate } = require("../utils/authValidate");

// Tokens
const {
	getAccessToken,
	getRefreshToken,
	verifyToken,
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
		`INSERT INTO public."user"(id_user, email, password, username, language, theme, hide_email, last_seen, deleted) 
			VALUES (default, $1, $2, $3, $4, $5, $6, NOW(), FALSE)`,
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

async function loginService(email, password) {
	if (!loginValidate(email, password)) {
		return { accessToken: "", refreshToken: "", error: "login-data-invalid" };
	}

	const userQuery = await db.query(
		`SELECT id_user, email, password, username, language, theme, hide_email, last_seen, deleted FROM public."user" WHERE email = $1`,
		[email]
	);
	if (
		!userQuery.rows[0] ||
		!(await bcrypt.compare(password, userQuery.rows[0]?.password)) ||
		userQuery.rows[0].deleted
	) {
		return {
			accessToken: "",
			refreshToken: "",
			user: {},
			error: "login-data-invalid",
		};
	}

	const accessToken = getAccessToken({ username: userQuery.rows[0].username });
	const refreshToken = getRefreshToken({
		username: userQuery.rows[0].username,
	});
	const user = {
		id: userQuery.rows[0].id_user,
		email: userQuery.rows[0].email,
		username: userQuery.rows[0].username,
		language: userQuery.rows[0].language,
		theme: userQuery.rows[0].theme,
		hideEmail: userQuery.rows[0].hide_email,
		lastSeen: userQuery.rows[0].lastSeen,
	};

	const tokenQuery = await db.query(
		`UPDATE public."user" SET last_seen = NOW(), refresh_token = $1 WHERE email = $2`,
		[refreshToken, email]
	);
	return { accessToken, refreshToken, user, error: "" };
}

async function accessService(authHeader) {
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return { user: {}, error: "unauthorized" };
	}
	const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
	if (decoded) {
		const userQuery = await db.query(
			`SELECT id_user, email, username, language, theme, hide_email, last_seen, deleted FROM public."user" WHERE username = $1`,
			[decoded.username]
		);
		if (userQuery.rows[0] && !userQuery.rows[0].deleted) {
			const user = {
				id: userQuery.rows[0].id_user,
				email: userQuery.rows[0].email,
				username: userQuery.rows[0].username,
				language: userQuery.rows[0].language,
				theme: userQuery.rows[0].theme,
				hideEmail: userQuery.rows[0].hide_email,
				lastSeen: userQuery.rows[0].lastSeen,
			};
			return { user, error: "" };
		}
	}
	return { user: {}, error: "forbidden" };
}

async function refreshService(authHeader) {
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return "unauthorized";
	}
	if (verifyToken(token, process.env.REFRESH_TOKEN_SECRET)) {
		const refreshQuery = await db.query(
			`SELECT username, refresh_token, deleted FROM public."user" WHERE refresh_token = $1`,
			[token]
		);
		if (refreshQuery.rows[0] && !refreshQuery.rows[0].deleted) {
			return getAccessToken({ username: refreshQuery.rows[0].username });
		}
	}
	return "forbidden";
}

async function logoutService(req) {
	const accessToken =
		req.headers.authorization && req.headers.authorization.split(" ")[1];
	const refreshToken =
		req.cookies.refresh_token && req.cookies.refresh_token.split(" ")[1];

	if (!accessToken || !refreshToken) {
		return "unauthorized";
	}
	if (
		verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET) &&
		verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET)
	) {
		const logoutQuery = await db.query(
			`UPDATE public."user" SET refresh_token = NULL WHERE refresh_token = $1`,
			[refreshToken]
		);
		return "";
	}
	return "forbidden";
}

module.exports = {
	registerService,
	loginService,
	accessService,
	refreshService,
	logoutService,
};
