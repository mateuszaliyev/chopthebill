// Config
const { db } = require("../config/db");

// Validation
const { expenseValidate } = require("../utils/validate");

async function addExpenseService(decoded, { expense, obligations }) {
	if (expense.group) {
		const authQuery = await db.query(
			`
			SELECT a.id_affiliation
			FROM public.affiliation a
			JOIN public.group g ON a.id_group = g.id_group
			JOIN public.user u ON a.id_user = u.id_user
			WHERE g.id_group = $1 AND u.id_user = $2 AND a.valid = TRUE AND g.deleted = FALSE AND u.deleted = FALSE`,
			[expense.group, decoded.id]
		);

		if (!authQuery.rows[0]) {
			return [];
		}
	}

	const issues = expenseValidate(expense.title, expense.description);

	if (issues.length > 0) {
		return issues;
	}

	const sum = obligations.reduce((prev, curr) => prev + curr.amount, 0);

	if (obligations.length === 0 || expense.amount !== sum) {
		return [];
	}

	const expenseQuery = await db.query(
		`
		INSERT INTO public.expense
		VALUES (DEFAULT, $1, $2, $3, $4, $5, FALSE, FALSE, $6, $7)
		RETURNING id_expense`,
		[
			expense.title,
			expense.description,
			expense.date,
			expense.amount,
			expense.currency,
			expense.user,
			expense.group,
		]
	);

	const id = expenseQuery.rows[0].id_expense;

	const obligationQueryText = obligations.reduce(
		(prev, curr, index) =>
			`${prev}${index !== 0 ? ", " : ""}(DEFAULT, ${
				curr.amount
			}, FALSE, FALSE, ${curr.debtor}, ${curr.creditor}, ${id})${
				index === obligations.length - 1 ? ";" : ""
			}`,
		"INSERT INTO public.obligation VALUES "
	);

	await db.query(obligationQueryText);

	return null;
}

async function expenseService(decoded, id) {
	const expenseQuery = await db.query(
		`
		SELECT e.title, e.description, e.date, e.amount, e.currency, e.settled, g.id_group, g.name, u.id_user, u.username, u.avatar
		FROM public.expense e
		LEFT JOIN public.group g ON e.id_group = g.id_group
		JOIN public.user u ON e.id_user = u.id_user
		WHERE e.id_expense = $1 AND e.id_user = $2 AND e.deleted = FALSE AND (g.deleted = FALSE OR g.deleted IS NULL) AND u.deleted = FALSE`,
		[id, decoded.id]
	);

	if (!expenseQuery.rows[0]) {
		return null;
	}

	const obligationQuery = await db.query(
		`
		SELECT
			o.id_obligation, o.amount, o.settled,
			c.id_user AS creditor_id, c.username AS creditor_username, c.avatar AS creditor_avatar,
			d.id_user AS debtor_id, d.username AS debtor_username, d.avatar AS debtor_avatar
		FROM public.obligation o
		JOIN public.user c ON c.id_user = o.id_user_creditor
		JOIN public.user d ON d.id_user = o.id_user_debtor
		WHERE o.id_expense = $1 AND o.deleted = FALSE`,
		[id]
	);

	if (!obligationQuery.rows[0]) {
		return null;
	}

	const expense = {
		amount: parseInt(expenseQuery.rows[0].amount),
		currency: expenseQuery.rows[0].currency,
		date: expenseQuery.rows[0].date,
		description: expenseQuery.rows[0].description,
		group: {
			id: expenseQuery.rows[0].id_group,
			name: expenseQuery.rows[0].name,
		},
		title: expenseQuery.rows[0].title,
		user: {
			avatar: expenseQuery.rows[0].avatar,
			id: expenseQuery.rows[0].id_user,
			username: expenseQuery.rows[0].username,
		},
	};

	const obligations = obligationQuery.rows.map((obligation) => ({
		amount: obligation.amount,
		creditor: {
			avatar: obligation.creditor_avatar,
			id: obligation.creditor_id,
			username: obligation.creditor_username,
		},
		debtor: {
			avatar: obligation.debtor_avatar,
			id: obligation.debtor_id,
			username: obligation.debtor_username,
		},
	}));

	const userIds = new Set();

	obligationQuery.rows.forEach((obligation) => {
		userIds.add(obligation.creditor_id);
		userIds.add(obligation.debtor_id);
	});

	const users = [...userIds].map((id) => {
		const userObligation = obligations.find(
			(obligation) =>
				id === obligation.creditor.id || id === obligation.debtor.id
		);

		const amount = obligations
			.filter(
				(obligation) =>
					id === obligation.creditor.id || id === obligation.debtor.id
			)
			.reduce((prev, curr) => prev + parseInt(curr.amount), 0);
		const creditor = id === userObligation.creditor.id;

		const user = creditor ? userObligation.creditor : userObligation.debtor;

		return {
			...user,
			amount,
			creditor,
			percentage: (100 * amount) / expense.amount,
			selected: false,
			share: 0,
			textField: {
				amount: (amount / 100).toFixed(2),
				percentage: (100 * amount) / expense.amount,
				share: 0,
			},
		};
	});

	const data = {
		expense,
		obligations,
		users,
	};

	return data;
}

async function expensesService(decoded) {
	const obligationQuery = await db.query(
		`
		SELECT *
		FROM public.obligation
		WHERE id_expense IN (
			SELECT id_expense
			FROM public.obligation
			WHERE id_user_creditor = $1 OR id_user_debtor = $1 AND deleted = FALSE
		) AND deleted = FALSE`,
		[decoded.id]
	);

	if (!obligationQuery.rows[0]) {
		return [];
	}

	const expenseIds =
		obligationQuery.rows[0] &&
		new Set(
			obligationQuery.rows.map((obligation) => parseInt(obligation.id_expense))
		);

	const expenseQueryText = `
		SELECT e.id_expense, e.title, e.description, e.date, e.amount, e.currency, e.settled, e.id_user, g.id_group, g.name
		FROM public.expense e
		LEFT JOIN public.group g ON e.id_group = g.id_group
		WHERE (id_user = $1 ${
			expenseIds
				? `OR id_expense IN (${[...expenseIds].reduce(
						(prev, curr, index) => `${prev}${index !== 0 ? ", " : ""}${curr}`,
						""
				  )})) AND e.deleted = FALSE`
				: ""
		}`;

	const expenseQuery = await db.query(expenseQueryText, [decoded.id]);

	if (!expenseQuery.rows[0]) {
		null;
	}

	const userIds = new Set(
		(() => {
			const ids = [];
			expenseQuery.rows.forEach((expense) => {
				ids.push(parseInt(expense.id_user));
			});
			obligationQuery.rows.forEach((obligation) => {
				ids.push(parseInt(obligation.id_user_creditor));
				ids.push(parseInt(obligation.id_user_debtor));
			});
			return ids;
		})()
	);

	const userQueryText = `SELECT id_user, username, avatar FROM public.user WHERE id_user IN (${[
		...userIds,
	].reduce(
		(prev, curr, index) => `${prev}${index !== 0 ? ", " : ""}${curr}`,
		""
	)}) AND deleted = FALSE`;

	const userQuery = await db.query(userQueryText);

	const data = expenseQuery.rows.map((expense) => {
		const obligations = [];

		obligationQuery.rows.forEach((obligation) => {
			if (expense.id_expense === obligation.id_expense) {
				const creditor = userQuery.rows.find(
					(user) => user.id_user === obligation.id_user_creditor
				);
				const debtor = userQuery.rows.find(
					(user) => user.id_user === obligation.id_user_debtor
				);
				obligations.push({
					amount: obligation.amount,
					creditor: creditor
						? {
								avatar: creditor.avatar,
								id: creditor.id_user,
								username: creditor.username,
						  }
						: null,
					debtor: debtor
						? {
								avatar: debtor.avatar,
								id: debtor.id_user,
								username: debtor.username,
						  }
						: null,
					settled: obligation.settled,
				});
			}
		});

		const user = userQuery.rows.find(
			(user) => user.id_user === expense.id_user
		);

		return {
			expense: {
				amount: expense.amount,
				currency: expense.currency,
				date: expense.date,
				description: expense.description,
				group: {
					id: expense.id_group,
					name: expense.name,
				},
				id: expense.id_expense,
				settled: expense.settled,
				title: expense.title,
				user: user
					? {
							avatar: user.avatar,
							id: user.id_user,
							username: user.username,
					  }
					: null,
			},
			obligations,
		};
	});

	return data.sort(
		(a, b) => new Date(b.expense.date) - new Date(a.expense.date)
	);
}

async function settleExpenseService(decoded, id) {
	const authQuery = await db.query(
		`
		SELECT *
		FROM public.expense
		WHERE (
			SELECT COUNT(*)
			FROM public.obligation
			WHERE id_expense = $1 AND settled = FALSE
		) = 0 AND id_expense = $1 AND id_user = $2`,
		[id, decoded.id]
	);

	if (!authQuery.rows[0]) {
		return true;
	}

	await db.query(
		`
		UPDATE public.expense
		SET settled = TRUE
		WHERE id_expense = $1`,
		[id]
	);

	return false;
}

async function updateExpenseService(decoded, { expense, obligations }) {
	if (expense.group) {
		const authQuery = await db.query(
			`
			SELECT a.id_affiliation
			FROM public.affiliation a
			JOIN public.group g ON a.id_group = g.id_group
			JOIN public.user u ON a.id_user = u.id_user
			WHERE g.id_group = $1 AND u.id_user = $2 AND a.valid = TRUE AND g.deleted = FALSE AND u.deleted = FALSE`,
			[expense.group, decoded.id]
		);

		if (!authQuery.rows[0]) {
			return [];
		}
	}

	const issues = expenseValidate(expense.title, expense.description);

	if (issues.length > 0) {
		return issues;
	}

	const sum = obligations.reduce((prev, curr) => prev + curr.amount, 0);

	if (obligations.length === 0 || expense.amount !== sum) {
		return [];
	}

	const expenseQuery = await db.query(
		`
		UPDATE public.expense
		SET title = $1, description = $2, date = $3, amount = $4, currency = $5, settled = FALSE
		WHERE id_expense = $6 AND deleted = FALSE AND settled = FALSE
		RETURNING id_expense`,
		[
			expense.title,
			expense.description,
			expense.date,
			expense.amount,
			expense.currency,
			expense.id,
		]
	);

	if (!expenseQuery.rows[0]) {
		return [];
	}

	const obligationQuery = await db.query(
		`
		SELECT id_obligation, amount, settled, deleted, id_user_creditor, id_user_debtor
		FROM public.obligation
		WHERE id_expense = $1`,
		[expense.id]
	);

	if (!obligationQuery.rows[0]) {
		return [];
	}

	const currentObligations = obligationQuery.rows.map((obligation) => ({
		amount: obligation.amount,
		creditor: obligation.id_user_creditor,
		debtor: obligation.id_user_debtor,
		deleted: obligation.deleted,
		id: obligation.id_obligation,
		settled: obligation.settled,
	}));

	const obligationUpdateData = currentObligations.map((currentObligation) => {
		const obligation = obligations.find(
			(obligation) =>
				currentObligation.creditor === obligation.creditor &&
				currentObligation.debtor === obligation.debtor
		);

		return {
			amount: obligation?.amount ? obligation.amount : currentObligation.amount,
			creditor: obligation?.creditor
				? obligation.creditor
				: currentObligation.creditor,
			debtor: obligation?.debtor ? obligation.debtor : currentObligation.debtor,
			deleted: obligation?.amount ? false : true,
			id: currentObligation.id,
			settled: obligation?.amount ? false : currentObligation.settled,
		};
	});

	const obligationUpdateQuery = `
		UPDATE public.obligation
		SET amount = CASE id_obligation ${obligationUpdateData.reduce(
			(prev, curr) => `${prev}WHEN ${curr.id} THEN ${curr.amount} `,
			""
		)}END, id_user_creditor = CASE id_obligation ${obligationUpdateData.reduce(
		(prev, curr) => `${prev}WHEN ${curr.id} THEN ${curr.creditor} `,
		""
	)}END, id_user_debtor = CASE id_obligation ${obligationUpdateData.reduce(
		(prev, curr) => `${prev}WHEN ${curr.id} THEN ${curr.debtor} `,
		""
	)}END, settled = CASE id_obligation ${obligationUpdateData.reduce(
		(prev, curr) => `${prev}WHEN ${curr.id} THEN ${curr.settled} `,
		""
	)}END, deleted = CASE id_obligation ${obligationUpdateData.reduce(
		(prev, curr) => `${prev}WHEN ${curr.id} THEN ${curr.deleted} `,
		""
	)}END WHERE id_obligation IN(${obligationUpdateData.reduce(
		(prev, curr, index) => `${prev}${index === 0 ? "" : ", "}${curr.id}`,
		""
	)}) AND id_expense = $1`;

	await db.query(obligationUpdateQuery, [expenseQuery.rows[0].id_expense]);

	const obligationInsertData = obligations.filter(
		(obligation) =>
			!Boolean(
				currentObligations.find(
					(currentObligation) =>
						currentObligation.creditor === obligation.creditor &&
						currentObligation.debtor === obligation.debtor
				)
			)
	);

	const obligationInsertQuery = obligationInsertData.reduce(
		(prev, curr, index) =>
			`${prev}${index !== 0 ? ", " : ""}(DEFAULT, ${
				curr.amount
			}, FALSE, FALSE, ${curr.debtor}, ${curr.creditor}, ${expense.id})${
				index === obligationInsertData.length - 1 ? ";" : ""
			}`,
		"INSERT INTO public.obligation VALUES "
	);

	await db.query(obligationInsertQuery);

	return null;
}

module.exports = {
	addExpenseService,
	expenseService,
	expensesService,
	settleExpenseService,
	updateExpenseService,
};
