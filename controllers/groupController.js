const {
	getMembersService,
	userGroupsService,
	createGroupService,
	addUserToGroupService,
	deleteGroupService
} = require("../models/groupService");

async function getMembersController(req, res) {
	try {
		const authHeader = req.headers.authorization;
		const groupId = req.body.id_group;
		const userId = req.body.id_user;

		const { error, result } = await getMembersService(groupId, userId, authHeader);

		if (error === "unauthorized") {
			return res.status(401).json({ error, result });
		}
		if (error === "forbidden") {
			return res.status(403).json({ error, result });
		}
		return res.status(200).json({ error, result });
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			error: "internal-server-error",
			result: []
		});
	}
}

async function getGroupsController(req, res) {
	try {
		const authHeader = req.headers.authorization;
		const userId = req.body.id;

		const { error, result } = await userGroupsService(userId, authHeader);

		if (error === "unauthorized") {
			return res.status(401).json({ error, result });
		}
		if (error === "forbidden") {
			return res.status(403).json({ error, result });
		}
		return res.status(200).json({ error, result });
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			error: "internal-server-error",
			result: []
		});
	}
}

async function createGroupController(req, res) {
	try {
		const authHeader = req.headers.authorization;
		const group = {
			name: req.body.name,
			description: req.body.description,
			members: req.body.members
		}
		
		// Create group
		const { error, result } = createGroupService(group.name, group.description, group.members, authHeader);
		if (error === "unauthorized") {
			return res.status(401).json({ error, result });
		}
		if (error === "forbidden") {
			return res.status(403).json({ error, result });
		}
		// OK
		return res.status(200).json({ error, result });
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			error: "internal-server-error",
			result: []
		});
	}
}

async function addAffiliationController(req, res) {
	try {
		const authHeader = req.headers.authorization;
		const affiliation = {
			groupId: req.body.groupId,
			userId: req.body.userId,
			owner: req.body.owner
		}
		
		// TODO: check if affiliation doesn't already exist
		const { error, result } = addUserToGroupService(affiliation.groupId, affiliation.userId, owner, authHeader);
		if (error === "unauthorized") {
			return res.status(401).json({ error, result });
		}
		if (error === "forbidden") {
			return res.status(403).json({ error, result });
		}

		return res.status(200).json({ error, result });
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			error: "internal-server-error",
			result: []
		});
	}
}

async function deleteGroupController(req, res) {
	try {
		const authHeader = req.headers.authorization;
		const groupId = req.body.id_group;

		const { error, result } = await deleteGroupService(groupId, authHeader);

		if (error === "unauthorized") {
			return res.status(401).json({ error, result });
		}
		if (error === "forbidden") {
			return res.status(403).json({ error, result });
		}
		// OK
		return res.status(200).json({ error, result });
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			error: "internal-server-error",
			result: []
		});
	}
}

module.exports = {
	getMembersController,
	getGroupsController,
	createGroupController,
	addAffiliationController,
	deleteGroupController
};
