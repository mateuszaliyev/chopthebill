// Config
const { db } = require("../config/db");

// Validation
const { groupValidate } = require("../utils/validate");

async function authGroupService(decoded, id) {
	const authQuery = await db.query(
		`
		SELECT g.id_group, g.name, g.description
		FROM public.group g
		JOIN public.affiliation a ON a.id_group = g.id_group
		WHERE a.id_user = $1 AND g.id_group = $2 AND a.valid = TRUE AND g.deleted = FALSE`,
		[decoded.id, id]
	);

	if (!authQuery.rows[0]) {
		return null;
	}

	return {
		description: authQuery.rows[0].description,
		id: authQuery.rows[0].id_group,
		name: authQuery.rows[0].name,
	};
}

/**
 * Create a group
 * @param {*} group new group
 * @returns 
 */
async function createGroupService(group) {
	const issues = groupValidate(group.name, group.description);


	if (issues.length > 0) {
		return issues;
	}

	const existsQuery = await db.query(
		`SELECT id_group FROM public.group WHERE name = $1`,
		[group.name]
	);

	if (existsQuery.rows[0]) {
		return ["name-taken"];
	}

	const groupQuery = await db.query(
		`INSERT INTO public.group VALUES (DEFAULT, $1, $2, FALSE) RETURNING id_group`,
		[group.name, group.description]
	);

	const id = groupQuery.rows[0].id_group;

	const affiliationQuery = `INSERT INTO public.affiliation VALUES ${group.members.reduce(
		(prev, curr, index) =>
			`${prev}${index === 0 ? "" : ", "}(DEFAULT, ${curr.owner}, TRUE, ${
				curr.id
			}, ${id})`,
		""
	)}`;

	await db.query(affiliationQuery);

	return null;
}

/**
 * Delete a group
 * @param {*} decoded 
 * @param {*} id id of a group to delete
 * @returns 
 */
async function deleteGroupService(decoded, id) {
	const authorizationQuery = await db.query(
		`SELECT id_affiliation 
		FROM public.affiliation a JOIN public.group g ON a.id_group = g.id_group 
		WHERE a.id_user = $1 AND a.owner = TRUE AND a.valid = TRUE AND g.id_group = $2 AND g.deleted = FALSE`,
		[decoded.id, id]
	);

	if (!authorizationQuery.rows[0]) {
		return true;
	}

	await db.query(`UPDATE public.group SET deleted = TRUE WHERE id_group = $1`, [
		id,
	]);

	return false;
}

async function groupService(decoded, id) {
	// Get group members
	const affiliationQuery = await db.query(
		`SELECT a.owner, u.id_user, u.email, u.username, u.avatar, u.hide_email 
		FROM public.affiliation a JOIN public.user u ON a.id_user = u.id_user 
		WHERE a.id_group = $1 AND a.valid = TRUE AND u.deleted = FALSE`,
		[id]
	);

	if (!affiliationQuery.rows[0]) {
		return null;
	}

	const authorized = affiliationQuery.rows.some(
		(affiliation) => affiliation.id_user === decoded.id
	);

	if (!authorized) {
		return null;
	}

	// Get group info
	const groupQuery = await db.query(
		`SELECT id_group, name, description FROM public.group WHERE id_group = $1 AND deleted = FALSE`,
		[id]
	);

	if (!groupQuery.rows[0]) {
		return null;
	}

	// Get group expenses
	const expenseQuery = await db.query(
		`SELECT e.id_expense, e.title, e.description, e.date, e.amount, e.currency, e.settled, u.id_user, u.username, u.avatar 
		FROM public.expense e JOIN public.user u ON e.id_user = u.id_user 
		WHERE e.id_group = $1`,
		[id]
	);

	let expenses = [];

	if (expenseQuery.rows[0]) {
		// Get group obligations
		const obligationQueryString = `SELECT * FROM public.obligation WHERE id_expense IN (${expenseQuery.rows.reduce(
			(prev, curr, index) =>
				`${prev}${index === 0 ? "" : ", "}${curr.id_expense}`,
			""
		)})`;

		const obligationQuery = await db.query(obligationQueryString);

		if (obligationQuery.rows[0]) {
			expenses = expenseQuery.rows.map((expense) => ({
				expense: {
					amount: expense.amount,
					currency: expense.currency,
					date: expense.date,
					description: expense.description,
					group: {
						id: groupQuery.rows[0].id_group,
						name: groupQuery.rows[0].name,
					},
					id: expense.id_expense,
					settled: expense.settled,
					title: expense.title,
					user: {
						avatar: expense.avatar,
						id: expense.id_user,
						username: expense.username,
					},
				},
				obligations: obligationQuery.rows
					.filter((obligation) => obligation.id_expense === expense.id_expense)
					.map((obligation) => {
						const creditor = affiliationQuery.rows.find(
							(affiliation) =>
								affiliation.id_user === obligation.id_user_creditor
						);
						const debtor = affiliationQuery.rows.find(
							(affiliation) => affiliation.id_user === obligation.id_user_debtor
						);
						return {
							amount: obligation.amount,
							creditor: {
								avatar: creditor.avatar,
								id: creditor.id_user,
								username: creditor.username,
							},
							debtor: {
								avatar: debtor.avatar,
								id: debtor.id_user,
								username: debtor.username,
							},
						};
					}),
			}));
		}
	}

	// All in One group
	const group = {
		description: groupQuery.rows[0].description,
		expenses,
		id: groupQuery.rows[0].id_group,
		members: affiliationQuery.rows.map((member) => ({
			avatar: member.avatar,
			email: member.hide_email ? "" : member.email,
			id: member.id_user,
			owner: member.owner,
			username: member.username,
		})),
		name: groupQuery.rows[0].name,
	};

	return group;
}

/**
 * 
 * @param {*} decoded 
 * @returns groups with members of a decoded user
 */
async function groupsService(decoded) {
	// Get user's groups
	const groupQuery = await db.query(
		`SELECT g.id_group, g.name, g.description
		FROM public.affiliation a JOIN public.group g ON a.id_group = g.id_group 
		WHERE a.id_user = $1 AND a.valid = TRUE AND g.deleted = FALSE`,
		[decoded.id]
	);

	if (!groupQuery.rows[0]) {
		return null;
	}

	const groupIdsString = groupQuery.rows.reduce(
		(prev, curr, index) =>
			index === 0 ? `${curr.id_group}` : `${prev}, ${curr.id_group}`,
		""
	);

	// Get members of user's groups
	const affiliationQuery = await db.query(
		`SELECT a.owner, a.id_group, u.id_user, u.email, u.username, u.avatar, u.hide_email 
		FROM public.affiliation a JOIN public.user u ON a.id_user = u.id_user 
		WHERE a.id_group IN (${groupIdsString}) AND a.valid = TRUE AND u.deleted = FALSE`,
		[]
	);

	if (!affiliationQuery.rows[0]) {
		return null;
	}

	// User's groups with members
	const groups = groupQuery.rows
		.map((group) => ({
			description: group.description,
			id: group.id_group,
			members: affiliationQuery.rows
				.filter((member) => group.id_group === member.id_group)
				.map((member) => ({
					avatar: member.avatar,
					email: member.hide_email ? "" : member.email,
					id: member.id_user,
					owner: member.owner,
					username: member.username,
				})),
			name: group.name,
		}))
		.sort((a, b) => (a.name < b.name ? -1 : 1));

	return groups;
}

/**
 * Updates group name, description and members
 * @param {*} decoded 
 * @param {*} group updated group
 * @returns 
 */
async function updateGroupService(decoded, group) {
	const issues = groupValidate(group.name, group.description);

	if (issues.length > 0) {
		return issues;
	}

	// Check if group with a given group.name exists
	const existsQuery = await db.query(
		`SELECT id_group 
		FROM public.group 
		WHERE id_group != $1 AND name = $2`,
		[group.id, group.name]
	);

	if (existsQuery.rows[0]) {
		return ["name-taken"];
	}

	// Get all affiliations
	const affiliationQuery = await db.query(
		`SELECT a.id_affiliation, a.owner, a.valid, a.id_user
		FROM public.affiliation a 
		JOIN public.group g ON a.id_group = g.id_group 
		WHERE g.id_group = $1 AND g.deleted = FALSE`,
		[group.id]
	);

	if (!affiliationQuery.rows[0]) {
		return null;
	}

	// Authorize user
	const authorized = affiliationQuery.rows.some(
		(affiliation) =>
			affiliation.owner &&
			affiliation.valid &&
			affiliation.id_user === decoded.id
	);

	if (!authorized) {
		return ["forbidden"];
	}

	// Update group name and description
	await db.query(
		`UPDATE public.group 
		SET name = $1, description = $2 
		WHERE id_group = $3`,
		[group.name, group.description, group.id]
	);

	const currentMemberIds = affiliationQuery.rows.map(
		(affiliation) => affiliation.id_user
	);

	// List of updated members
	const affiliationUpdateData = currentMemberIds.map((id) => ({
		id,
		owner: group.members.find((member) => member.id === id)?.owner || false,
		valid:
			group.members.findIndex((member) => member.id === id) === -1
				? false
				: true,
	}));

	// Update owner and valid
	const affiliationUpdateQuery = `
		UPDATE public.affiliation 
		SET owner = CASE id_user ${affiliationUpdateData.reduce(
		(prev, curr) => `${prev}WHEN ${curr.id} THEN ${curr.owner} `,
		""
	)}END, valid = CASE id_user ${affiliationUpdateData.reduce(
		(prev, curr) => `${prev}WHEN ${curr.id} THEN ${curr.valid} `,
		""
	)}END WHERE id_user IN(${affiliationUpdateData.reduce(
		(prev, curr, index) => `${prev}${index === 0 ? "" : ", "}${curr.id}`,
		""
	)}) AND id_group = $1`;

	await db.query(affiliationUpdateQuery, [group.id]);

	// Only new members
	const affiliationInsertData = group.members
		.filter((member) => currentMemberIds.indexOf(member.id) === -1)
		.map((member) => ({
			id: member.id,
			owner: member.owner,
		}));

	// No new members
	if (affiliationInsertData.length === 0) {
		return null;
	}

	// Insert new members
	let i = 2;
	const affiliationInsertQuery = `INSERT INTO public.affiliation VALUES ${affiliationInsertData.reduce(
		(prev, curr, index) => 
		`${prev}${index === 0 ? "" : ", "}(DEFAULT, $${i++}, TRUE, $${i++}, $1)`,
		""
	)}`;

	await db.query(affiliationInsertQuery, [group.id].concat(affiliationInsertData.reduce(
		(params, member) => params.concat(member.id, member.owner),
		[]
	)));

	return null;
}

module.exports = {
	authGroupService,
	createGroupService,
	deleteGroupService,
	groupService,
	groupsService,
	updateGroupService,
};
