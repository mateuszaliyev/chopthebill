const {
	profileService,
	settingsService,
	passwordService,
	deleteService,
} = require("../models/userService");

async function profileController(req, res) {
	try {
		const user = await profileService(res.locals.decoded, req.params.id);
		if (!user) {
			return res.sendStatus(400);
		}
		return res.status(200).json(user);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

async function settingsController(req, res) {
	try {
		const issues = await settingsService(res.locals.decoded, req.body);
		if (issues.length > 0) {
			return res.status(400).json(issues);
		}
		return res.status(200).json(issues);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

async function passwordController(req, res) {
	try {
		const issues = await passwordService(res.locals.decoded, req.body);
		if (issues.length > 0) {
			return res.status(400).json(issues);
		}
		return res.status(200).json(issues);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

async function deleteController(req, res) {
	try {
		const error = await deleteService(res.locals.decoded, req.body.password);
		if (error) {
			return res.status(400).json({ error });
		}
		return res.status(200).json({ error });
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

module.exports = {
	profileController,
	settingsController,
	passwordController,
	deleteController,
};
