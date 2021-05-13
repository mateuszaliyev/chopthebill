const {
	addFriendService,
	unfriendService,
	friendsService,
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

async function friendsController(req, res) {
	try {
		const { error, friends } = await friendsService(req.headers.authorization);
		if (error === "bad-request") {
			return res.status(400).json({ error, friends });
		}
		if (error === "unauthorized") {
			return res.status(401).json({ error, friends });
		}
		if (error === "forbidden") {
			return res.status(403).json({ error, friends });
		}
		return res.status(200).json({ error, friends });
	} catch (err) {
		console.log(err);
		return res
			.status(500)
			.json({ error: "internal-server-error", friends: [] });
	}
}

module.exports = { addFriendController, unfriendController, friendsController };
