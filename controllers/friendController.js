const {
	addFriendService,
	unfriendService,
} = require("../models/friendService");

async function addFriendController(req, res) {
	try {
		const error = await addFriendService(
			req.headers.authorization,
			req.body.id
		);
		if (error === "bad-request") {
			return res.sendStatus(400);
		}
		if (error === "unauthorized") {
			return res.sendStatus(401);
		}
		if (error === "forbidden") {
			return res.sendStatus(403);
		}
		return res.sendStatus(201);
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}
}

async function unfriendController(req, res) {
	try {
		const error = await unfriendService(req.headers.authorization, req.body.id);
		if (error === "bad-request") {
			return res.sendStatus(400);
		}
		if (error === "unauthorized") {
			return res.sendStatus(401);
		}
		if (error === "forbidden") {
			return res.sendStatus(403);
		}
		return res.sendStatus(204);
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}
}

module.exports = { addFriendController, unfriendController };
