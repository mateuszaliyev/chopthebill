// Config
require("dotenv").config();

const { db } = require("../config/db");
const { verifyToken } = require("../utils/jwt");

/**
 * Returns members in a given groupId
 */
async function getMembersService(groupId, authHeader) {
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return { error: "unauthorized", result: [] };
	}
	const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
	if (decoded) {
		const queryRes = await db.query(
			`SELECT u.id_user, u.email, u.username, u.hide_email, a.owner FROM public.user u, public.affiliation a 
			where u.id_user = a.id_user and a.valid = true and a.id_group = $1;`,
			[groupId]);
		return {error: "", result: queryRes.rows};
	}
	return { error: "forbidden", result: [] };
}

/**
 * Returns groups data based on userId that are not deleted groups
 */
async function userGroupsService(userId, authHeader) {
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return { error: "unauthorized", result: [] };
	}
	const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
	if (decoded) {
		const queryRes = await db.query(
			`SELECT g.id_group, g.name, g.description FROM public.affiliation a, public."group" g
			WHERE a.id_user = $1 AND a.id_group = g.id_group AND g.deleted = False`,
			[userId]
		);
		return { error: "", result: queryRes.rows };
	}
	return { error: "forbidden", result: [] };
}

/**
 * Create group with given name and description.
 * Returns 
 */
async function createGroupService(name, description, authHeader) {
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return { error: "unauthorized", result: [] };
	}
	const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
	if (decoded) {
		const queryRes = await db.query(
			`INSERT INTO public."group" (name, description, deleted)
			VALUES ($1, $2, false);`,
			[name, description]
		);
		console.log(queryRes);

		// TODO: create affiliations
		const groupId = -1;

		return {error: "", result: [groupId]};
	}
	return { error: "forbidden", result: [] };
}

/**
 * Create affiliation between groupId and userId.
 */
async function addUserToGroupService(groupId, userId, hasOwner, authHeader) {
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return { error: "unauthorized", result: [] };
	}
	const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
	if (decoded) {
		const queryRes = await db.query(
			`INSERT INTO public.affiliation (id_group, id_user, owner)
			VALUES ($1, $2, $3);`,
			[groupId, userId, hasOwner]);
	}
	return { error: "forbidden", result: [] };
}

/**
 * Delete a group with a given id
 * @param {*} groupId id of a group to delete
 * @param {*} authHeader header containing authentication token
 * @returns 
 */
async function deleteGroupService(groupId, authHeader) {
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return { error: "unauthorized", result: [] };
	}
	const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
	if (decoded) {
		// TODO: check if user has an owner
		const queryRes = await db.query(
			`UPDATE public."group"
			SET deleted = true
			WHERE id_group = $1;`,
			[groupId]);
		return { error: "", result: []}
	}
	return { error: "forbidden", result: [] };
}

module.exports = {
	getMembersService,
	userGroupsService,
	createGroupService,
	addUserToGroupService,
	deleteGroupService
};
