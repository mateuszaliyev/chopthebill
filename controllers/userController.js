const {
	profileService,
	settingsService,
	passwordService,
	deleteService,
} = require("../models/userService");

async function profileController(req, res) {
	try {
		const { error, user } = await profileService(
			req.params.id,
			req.headers.authorization
		);
		if (error === "unauthorized") {
			return res.status(401).json({ error, user });
		}
		if (error === "forbidden") {
			return res.status(403).json({ error, user });
		}

		return res.status(200).json({ error, user });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: "internal-server-error", user: {} });
	}
}

async function settingsController(req, res) {
	try {
		const { error, issues } = await settingsService(
			req.headers.authorization,
			req.body
		);
		if (error === "unauthorized") {
			return res.status(401).json({ error, issues });
		}
		if (error === "forbidden") {
			return res.status(403).json({ error, issues });
		}
		if (issues.length > 0) {
			return res.status(400).json({ error, issues });
		}

		return res.status(200).json({ error, issues: [] });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: "internal-server-error", issues: [] });
	}
}

async function passwordController(req, res) {
	try {
		const { error, issues } = await passwordService(
			req.headers.authorization,
			req.body
		);
		if (error === "unauthorized") {
			return res.status(401).json({ error, issues });
		}
		if (error === "forbidden") {
			return res.status(403).json({ error, issues });
		}
		if (issues.length > 0) {
			return res.status(400).json({ error, issues });
		}
		return res.status(200).json({ error, issues });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: "internal-server-error", issues: [] });
	}
}

async function deleteController(req, res) {
	try {
		const error = await deleteService(
			req.headers.authorization,
			req.body.password
		);
		if (error === "unauthorized") {
			return res.status(401).json({ error });
		}
		if (error === "forbidden") {
			return res.status(403).json({ error });
		}
		if (error === "password-different") {
			return res.status(400).json({ error });
		}
		return res.status(200).json({ error });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: "internal-server-error" });
	}
}

module.exports = {
	profileController,
	settingsController,
	passwordController,
	deleteController,
};
