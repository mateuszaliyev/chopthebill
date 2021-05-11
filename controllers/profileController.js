const { profileService } = require("../models/profileService");

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
module.exports = { profileController };
