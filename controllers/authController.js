const { db } = require("../config/db");
const { registerValidate } = require("../utils/authValidate");
const bcrypt = require("bcrypt");

async function register(req, res) {
	try {
		const issues = registerValidate(req.body);

		const emailQuery = await db.query(
			`SELECT email FROM public."user" WHERE email = $1`,
			[req.body.email]
		);

		if (emailQuery.rows[0]) {
			issues.push("email-taken");
		}

		const usernameQuery = await db.query(
			`SELECT username FROM public."user" WHERE username = $1`,
			[req.body.username]
		);

		if (usernameQuery.rows[0]) {
			issues.push("username-taken");
		}

		if (issues.length > 0) {
			return res.status(400).json(issues);
		}

		const password = await bcrypt.hash(req.body.password, 10);

		const userQuery = await db.query(
			`INSERT INTO public."user"(id_user, email, password, username, language, theme, hide_email) 
			VALUES (default, $1, $2, $3, $4, $5, $6)`,
			[
				req.body.email,
				password,
				req.body.username,
				req.body.language,
				req.body.theme,
				req.body.hideEmail,
			]
		);
		res.status(201).json([]);
	} catch (err) {
		console.log(err);
		res.status(500).json(["internal-server-error"]);
	}
}

module.exports = { register };
