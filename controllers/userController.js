const { profileService, settingsService } = require("../models/userService");

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
		const issues = await settingsService(req.headers.authorization, req.body);
		if (issues.length > 0) {
			return res.status(400).json(issues);
		}
		return res.status(200).json([]);
	} catch (err) {
		console.log(err);
		return res.status(500).json(["internal-server-error"]);
	}
}

module.exports = { profileController, settingsController };
