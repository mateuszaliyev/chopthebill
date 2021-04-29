const {
	registerService,
	loginService,
	accessService,
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
	const user = {
		email: req.body.email,
		password: req.body.password,
	};
	try {
		const data = await loginService(user);
		if (data.error) {
			return res.status(401).json(data);
		}
		res.status(200).json(data);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			accessToken: "",
			refreshToken: "",
			error: "internal-server-error",
		});
	}
}

async function accessController(req, res) {
	try {
		const error = accessService(req.headers.authorization);
		if (!error) {
			return res.sendStatus(200);
		}
		if (error === "unauthorized") {
			return res.sendStatus(401);
		}
		res.sendStatus(403);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}

module.exports = { registerController, loginController, accessController };
