// Config
const { db } = require("../config/db");

async function addExpenseService({ expense, obligations }) {
	const sum = obligations.reduce((prev, curr) => prev + curr.amount, 0);

	if (obligations.length >= 2 && expense.amount === sum) {
		const expenseQuery = await db.query(
			`INSERT INTO public.expense VALUES (DEFAULT, $1, $2, $3, $4, $5, FALSE, $6, $7) RETURNING id_expense`,
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
				`${prev}${index !== 0 ? ", " : ""}(DEFAULT, ${curr.amount}, FALSE, ${
					curr.debtor
				}, ${curr.creditor}, ${id})${
					index === obligations.length - 1 ? ";" : ""
				}`,
			"INSERT INTO public.obligation VALUES "
		);

		await db.query(obligationQueryText);

		return false;
	}

	return true;
}

async function expensesService(decoded) {
	const obligationQuery = await db.query(
		`SELECT * FROM public.obligation WHERE id_user_creditor = $1 OR id_user_debtor = $1`,
		[decoded.id]
	);

	const expenseIds =
		obligationQuery.rows[0] &&
		new Set(
			obligationQuery.rows.map((obligation) => parseInt(obligation.id_expense))
		);

	const expenseQueryText = `SELECT * FROM public.expense WHERE id_user = $1 ${
		expenseIds
			? `OR id_expense IN (${[...expenseIds].reduce(
					(prev, curr, index) => `${prev}${index !== 0 ? ", " : ""}${curr}`,
					""
			  )})`
			: ""
	}`;

	const expenseQuery = await db.query(expenseQueryText, [decoded.id]);

	if (expenseQuery.rows[0]) {
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
		)})`;

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
					id: expense.id_expense,
					settled: expense.settled,
					title: expense.title,
					user: {
						avatar: user.avatar,
						id: user.id_user,
						username: user.username,
					},
				},
				obligations,
			};
		});
		return data;
	}

	return null;
}

module.exports = { addExpenseService, expensesService };
