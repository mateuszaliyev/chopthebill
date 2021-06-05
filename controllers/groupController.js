const {
	getMembersService,
	userGroupsService,
	createGroupService,
	deleteGroupService,
	groupNameService,
	groupDescriptionService,
	deleteMemberService,
	addMemberService
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
		const { error, result } = await createGroupService(group.name, group.description, group.members, authHeader);
		if (error === "bad-request") {
			return res.sendStatus(400).json({ error, result });
		}
		if (error === "unauthorized") {
			return res.status(401).json({ error, result });
		}
		if (error === "forbidden") {
			return res.status(403).json({ error, result });
		}
		// OK
		console.log(error, result);
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
		const userId = req.body.id_user;

		const { error, result } = await deleteGroupService(groupId, userId, authHeader);

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


async function groupNameController(req, res) {
	try {
		const authHeader = req.headers.authorization;
		const groupId = req.body.id_group;
		const userId = req.body.id_user;
		const name = req.body.name;
		
		const { error, result } = await groupNameService(groupId, userId, name, authHeader);

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

async function groupDescriptionController(req, res) {
	try {
		const authHeader = req.headers.authorization;
		const groupId = req.body.id_group;
		const userId = req.body.id_user;
		const description = req.body.description;

		const { error, result } = await groupDescriptionService(groupId, userId, description, authHeader);

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

async function deleteMemberController(req, res) {
	try {
		const authHeader = req.headers.authorization;
		const groupId = req.body.id_group;
		const userId = req.body.id_user;
		const ownerId = req.body.id_owner;

		const { error, result } = await deleteMemberService(groupId, userId, ownerId, authHeader);

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

async function addMemberController(req, res) {
	try {
		const authHeader = req.headers.authorization;
		const groupId = req.body.id_group;
		const userId = req.body.id_user;
		const ownerId = req.body.id_owner;
		const owner = req.body.owner;

		const { error, result } = await addMemberService(groupId, userId, ownerId, authHeader);

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
	deleteGroupController,
	groupNameController,
	groupDescriptionController,
	deleteMemberController,
	addMemberController
};
