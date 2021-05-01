const {
	registerService,
	loginService,
	accessService,
	refreshService,
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
		const { accessToken, refreshToken, error } = await loginService(user);
		if (error) {
			return res.status(401).json({ accessToken, error });
		}
		res
			.status(200)
			.cookie("refresh_token", `Bearer ${refreshToken}`, {
				expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
				httpOnly: true,
			})
			.json({ accessToken, error });
	} catch (err) {
		console.log(err);
		res.status(500).json({
			accessToken: "",
			refreshToken: "",
			error: "internal-server-error",
		});
	}
}

function accessController(req, res) {
	try {
		const result = accessService(req.headers.authorization);
		if (!result) {
			return res.sendStatus(200);
		}
		if (result === "unauthorized") {
			return res.sendStatus(401);
		}
		if (result === "forbidden") {
			return res.sendStatus(403);
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

module.exports = {
	registerController,
	loginController,
	accessController,
	refreshController,
};
