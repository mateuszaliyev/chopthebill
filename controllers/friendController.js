const {
	addFriendService,
	unfriendService,
	friendsService,
} = require("../models/friendService");

async function addFriendController(req, res) {
	try {
		const error = await addFriendService(res.locals.decoded, req.body.id);
		if (error) {
			return res.sendStatus(400);
		}
		return res.sendStatus(201);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

async function unfriendController(req, res) {
	try {
		const error = await unfriendService(res.locals.decoded, req.body.id);
		if (error) {
			return res.sendStatus(400);
		}
		return res.sendStatus(204);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

async function friendsController(req, res) {
	try {
		const friends = await friendsService(res.locals.decoded);
		if (!friends) {
			return res.sendStatus(400);
		}
		return res.status(200).json(friends);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

module.exports = { addFriendController, unfriendController, friendsController };
