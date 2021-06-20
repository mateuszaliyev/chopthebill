const {
	notificationsService,
	obligationNotificationService,
	readNotificationService,
} = require("../models/notificationService");

async function notificationsController(req, res) {
	try {
		const notifications = await notificationsService(res.locals.decoded);
		if (!notifications) {
			return res.sendStatus(400);
		}
		return res.status(200).json(notifications);
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	}
}

async function obligationNotificationController(req, res) {
	try {
		const error = await obligationNotificationService(
			res.locals.decoded,
			req.body
		);
		if (error) {
			return res.sendStatus(400);
		}
		return res.sendStatus(204);
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	}
}

async function readNotificationController(req, res) {
	try {
		const error = await readNotificationService(
			res.locals.decoded,
			req.params.id
		);
		if (error) {
			return res.sendStatus(400);
		}
		return res.sendStatus(204);
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	}
}

module.exports = {
	notificationsController,
	obligationNotificationController,
	readNotificationController,
};
