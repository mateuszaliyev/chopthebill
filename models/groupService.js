// Config
require("dotenv").config();

const { db } = require("../config/db");
const { verifyToken } = require("../utils/jwt");

/**
 * 
 * @param {*} groupId group id
 * @param {*} authHeader header containing authentication token
 * @returns members data {id_user, username, email, owner} \
 * if email is hidden -> email = 'Email hidden'
 */
async function getMembersService(groupId, userId, authHeader) {
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return { error: "unauthorized", result: [] };
	}
	const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
	if (decoded) {
		const queryRes = await db.query(
			`SELECT u.id_user, u.username,
				CASE WHEN u.hide_email = false THEN u.email ELSE 'Email hidden' END AS "email",
				a.owner
			FROM public.user u, public.affiliation a
			WHERE u.id_user = a.id_user AND a.valid = true AND
				a.id_group = $1;`,
			[groupId]);

		// Check if user belongs to a given group
		if (queryRes.rows.some(row => row.id_user === userId)) {
			return {error: "", result: queryRes.rows};
		}
		// user doesn't belong to a give group -> permission denied
		return {error: "unauthorized", result: []};
	}
	return { error: "forbidden", result: [] };
}

/**
 * 
 * @param {*} userId user id
 * @param {*} authHeader header containing authentication token
 * @returns user's groups data { id_group, name, description }
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
 * 
 * @param {*} name group name
 * @param {*} description group description
 * @param {*} members list containing users in that group
 * @param {*} authHeader header containing authentication token
 */
async function createGroupService(name, description, members, authHeader) {
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return { error: "unauthorized", result: [] };
	}
	const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
	if (decoded) {
		// get group id
		const groupId = await db.query(`SELECT nextval('group_id_group_seq') AS "id";`).rows[0].id;
		
		// create group
		const queryResCreateGroup = await db.query(
			`INSERT INTO public."group" (id_group, name, description, deleted)
			VALUES ($1, $2, $3, false);`,
			[groupId, name, description]
		);

		// create affiliations
		let i = 1;
		const queryResAffiliations = await db.query(
			`INSERT INTO public.affiliation (id_group, id_user, owner, valid)
			VALUES ${members.map(() => `(${groupId}, $${i++}, $${i++}, true)`).join(',')}`,
			members.reduce((params, m) => params.concat([m.id_user, m.owner]), [])
		);

		return {error: "", result: []};
	}
	return { error: "forbidden", result: [] };
}

/**
 * Creates affiliation between groupId and userId.
 * @param {*} groupId group id
 * @param {*} userId id of a user that's getting added to a group
 * @param {*} ownerId id of a user that's trying to add a new user
 * @param {*} owner true if new user has an owner
 * @param {*} authHeader header containing authentication token
 */
async function addUserToGroupService(groupId, userId, ownerId, owner, authHeader) {
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return { error: "unauthorized", result: [] };
	}
	const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
	if (decoded) {
		// check if ownerId has an owner in that group
		const hasOwner = await db.query(
			`SELECT a.owner FROM public."group" g, public.affiliation a 
			WHERE g.id_group = a.id_group AND 
			g.id_group = $1 AND a.id_user = $2;`,
			[groupId, ownerId]).rows[0].owner;
		
		if (hasOwner == true) {
			const queryRes = await db.query(
				`INSERT INTO public.affiliation (id_group, id_user, owner, valid)
				VALUES ($1, $2, $3, true);`,
				[groupId, userId, owner]);
		}
	}
	return { error: "forbidden", result: [] };
}

/**
 * Delete a group with a given id
 * @param {*} groupId id of a group to delete
 * @param {*} userId id of a user thats trying to delete the group
 * @param {*} authHeader header containing authentication token
 */
async function deleteGroupService(groupId, userId, authHeader) {
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return { error: "unauthorized", result: [] };
	}
	const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
	if (decoded) {
		// check if user has an owner
		const hasOwner = await db.query(
			`SELECT a.owner FROM public."group" g, public.affiliation a 
			WHERE g.id_group = a.id_group AND 
			g.id_group = $1 AND a.id_user = $2;`,
			[groupId, userId]).rows[0].owner;

		if (hasOwner == true) {
			const queryRes = await db.query(
				`UPDATE public."group"
				SET deleted = true
				WHERE id_group = $1;`,
				[groupId]);
			return { error: "", result: []};
		}
		return { error: "unauthorized", result: [] };
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
