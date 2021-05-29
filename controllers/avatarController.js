const fs = require("fs");
const path = require("path");
const {
	addAvatarService,
	deleteAvatarService,
} = require("../models/avatarService");

async function avatarController(req, res) {
	const files = await fs.promises.readdir("public/avatars/");
	for (const file of files) {
		const id = file.split(".")[0];
		const extension = file.split(".")[1];
		if (id === req.params.id) {
			return res.sendFile(
				`/${id}.${extension}`,
				{
					root: path.join(__dirname, "../public/avatars"),
				},
				(err) => {}
			);
		}
	}
	res.sendStatus(204);
}

async function addAvatarController(req, res, next) {
	try {
		const error = await addAvatarService(req.headers.authorization);
		if (error === "bad-request") {
			return res.sendStatus(400);
		}
		if (error === "unauthorized") {
			return res.sendStatus(401);
		}
		if (error === "forbidden") {
			return res.sendStatus(403);
		}

		next();
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}
}

async function deleteAvatarController(req, res) {
	try {
		const error = await deleteAvatarService(req.headers.authorization);
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

module.exports = {
	avatarController,
	addAvatarController,
	deleteAvatarController,
};
