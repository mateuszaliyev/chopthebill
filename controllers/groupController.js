const {
	authGroupService,
	createGroupService,
	deleteGroupService,
	groupService,
	groupsService,
	updateGroupService,
} = require("../models/groupService");

async function authGroupController(req, res) {
	try {
		const group = await authGroupService(res.locals.decoded, req.params.id);
		if (!group) {
			return res.sendStatus(403);
		}
		return res.status(200).json(group);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

async function createGroupController(req, res) {
	try {
		const { error, id } = await createGroupService(req.body);
		if (error) {
			return res.status(400).json(error);
		}
		return res.status(201).send({ id });
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

async function deleteGroupController(req, res) {
	try {
		const error = await deleteGroupService(res.locals.decoded, req.params.id);
		if (error) {
			return res.sendStatus(400);
		}
		return res.sendStatus(204);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

async function groupController(req, res) {
	try {
		const group = await groupService(res.locals.decoded, req.params.id);
		if (!group) {
			return res.sendStatus(400);
		}
		return res.status(200).json(group);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

async function groupsController(req, res) {
	try {
		const groups = await groupsService(res.locals.decoded);
		if (!groups) {
			return res.sendStatus(400);
		}
		return res.status(200).json(groups);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

async function updateGroupController(req, res) {
	try {
		const error = await updateGroupService(res.locals.decoded, req.body);
		if (error && error.length > 0) {
			if (error[0] === "forbidden") {
				return res.status(403).json(error);
			}
			return res.status(400).json(error);
		}
		return res.sendStatus(200);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

module.exports = {
	authGroupController,
	createGroupController,
	deleteGroupController,
	groupController,
	groupsController,
	updateGroupController,
};
