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
		passwordConfirm: req.body.passwordConfirm,
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
		console.error(err);
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
			return res.status(401).json({ accessToken, refreshToken, user, error });
		}
		res.status(200).json({ accessToken, refreshToken, user, error });
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	}
}

async function accessController(req, res) {
	try {
		const user = await accessService(res.locals.decoded);
		if (user) {
			return res.status(200).json(user);
		}
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

async function refreshController(req, res) {
	try {
		const result = await refreshService(req.headers.authorization);
		if (result === "unauthorized") {
			return res.sendStatus(401);
		}
		if (result === "forbidden") {
			return res.sendStatus(403);
		}
		return res.status(200).json({ accessToken: result });
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	}
}

async function logoutController(req, res) {
	try {
		await logoutService(res.locals.decoded);
		return res.sendStatus(204);
	} catch (err) {
		console.error(err);
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
		console.error(err);
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
		console.error(err);
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
		console.error(err);
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
