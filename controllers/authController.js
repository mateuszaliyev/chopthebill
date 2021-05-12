const {
	registerService,
	loginService,
	accessService,
	refreshService,
	logoutService,
	forgotPasswordService,
	validateLinkService,
	resetPasswordService,
} = require("../models/authService");

async function registerController(req, res) {
	const user = {
		email: req.body.email,
		username: req.body.username,
		password: req.body.password,
		hideEmail: req.body.hideEmail,
		language: req.body.language,
		theme: req.body.theme,
	};
	try {
		const issues = await registerService(user);
		if (issues.length > 0) {
			return res.status(400).json(issues);
		}
		res.status(201).json([]);
	} catch (err) {
		console.log(err);
		res.status(500).json(["internal-server-error"]);
	}
}

async function loginController(req, res) {
	try {
		const email = req.body.email;
		const password = req.body.password;
		const { accessToken, refreshToken, user, error } = await loginService(
			email,
			password
		);
		if (error) {
			return res.status(401).json({ accessToken, user, error });
		}
		res
			.status(200)
			.cookie("refresh_token", `Bearer ${refreshToken}`, {
				expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
				httpOnly: true,
			})
			.json({ accessToken, user, error });
	} catch (err) {
		console.log(err);
		res.status(500).json({
			accessToken: "",
			user: {},
			error: "internal-server-error",
		});
	}
}

async function accessController(req, res) {
	try {
		const { user, error } = await accessService(req.headers.authorization);
		if (error === "unauthorized") {
			return res.sendStatus(401);
		}
		if (error === "forbidden") {
			return res.sendStatus(403);
		}
		if (user && !error) {
			return res.status(200).json(user);
		}
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}

async function refreshController(req, res) {
	try {
		const result = await refreshService(req.cookies.refresh_token);
		if (result === "unauthorized") {
			return res.sendStatus(401);
		}
		if (result === "forbidden") {
			return res.sendStatus(403);
		}
		return res.status(200).json({ accessToken: result });
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}

async function logoutController(req, res) {
	try {
		const result = await logoutService(req);
		if (result === "unauthorized") {
			return res.sendStatus(401);
		}
		if (result === "forbidden") {
			return res.sendStatus(403);
		}
		return res.clearCookie("refresh_token", { httpOnly: true }).sendStatus(204);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}

async function forgotPasswordController(req, res) {
	try {
		const { link, error } = await forgotPasswordService(req.body.email);
		if (error === "invalid-email") {
			return res.status(401).json({ link: "", error: "invalid-email" });
		}
		return res.status(200).json({ link, error });
	} catch (err) {
		console.log(err);
		res.status(500);
	}
}

async function validateLinkController(req, res) {
	try {
		const error = await validateLinkService(req.body.id, req.body.token);
		if (error === "invalid-link") {
			return res.status(403).json({ error });
		}
		if (error === "link-expired") {
			return res.status(401).json({ error });
		}
		return res.status(200).json({ error: "" });
	} catch (err) {
		console.log(err);
		res.status(500);
	}
}

async function resetPasswordController(req, res) {
	try {
		const error = await resetPasswordService(
			req.body.id,
			req.body.token,
			req.body.password
		);
		if (error === "invalid-link" || error === "invalid-password") {
			return res.status(403).json({ error });
		}
		if (error === "link-expired") {
			return res.status(401).json({ error });
		}
		return res.status(200).json({ error: "" });
	} catch (err) {
		console.log(err);
		res.status(500);
	}
}

module.exports = {
	registerController,
	loginController,
	accessController,
	refreshController,
	logoutController,
	forgotPasswordController,
	validateLinkController,
	resetPasswordController,
};
