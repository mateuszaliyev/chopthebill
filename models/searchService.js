// Config
const { db } = require("../config/db");

// Utils
const { closest, distance } = require("fastest-levenshtein");

async function searchService(decoded, query) {
	const expenseQuery = await db.query(
		`SELECT e.id_expense, e.title, e.description, e.date, e.amount, e.currency, e.settled, e.id_group, g.name FROM public.expense e LEFT JOIN public.group g ON e.id_group = g.id_group JOIN public.obligation o ON e.id_expense = o.id_expense WHERE o.id_user_creditor = $1 OR o.id_user_debtor = $1 GROUP BY e.id_expense, e.title, e.description, e.date, e.amount, e.currency, e.settled, e.id_group, g.name`,
		[decoded.id]
	);

	const groupQuery = await db.query(
		`SELECT g.id_group, g.name, g.description FROM public.group g JOIN public.affiliation a ON a.id_group = g.id_group WHERE a.id_user = $1 AND a.valid = TRUE AND g.deleted = FALSE`,
		[decoded.id]
	);

	const userQuery = await db.query(
		`SELECT id_user, email, username, avatar, hide_email, last_seen FROM public."user" WHERE deleted = FALSE`,
		[]
	);

	const results = {};

	if (expenseQuery.rows[0]) {
		const expenses = expenseQuery.rows.map((expense) => {
			const includes =
				expense.title.toLowerCase().includes(query.toLowerCase()) ||
				expense.description.toLowerCase().includes(query.toLowerCase());

			let match = distance(
				query.toLowerCase(),
				closest(query.toLowerCase(), [
					expense.title.toLowerCase(),
					expense.description.toLowerCase(),
				])
			);

			if (includes && match > 1) {
				match = 1;
			}

			return {
				amount: expense.amount,
				currency: expense.currency,
				date: expense.date,
				group: {
					name: expense.name,
				},
				id: expense.id_expense,
				match,
				title: expense.title,
			};
		});

		results.expenses = expenses
			.filter((expense) => expense.match <= 3)
			.sort((a, b) => {
				return a.match - b.match;
			});
	}

	if (groupQuery.rows[0]) {
		const groups = groupQuery.rows.map((group) => {
			const includes =
				group.name.toLowerCase().includes(query.toLowerCase()) ||
				group.description.toLowerCase().includes(query.toLowerCase());

			let match = distance(
				query.toLowerCase(),
				closest(query.toLowerCase(), [
					group.name.toLowerCase(),
					group.description.toLowerCase(),
				])
			);

			if (includes && match > 1) {
				match = 1;
			}

			return {
				description: group.description,
				id: group.id_group,
				match,
				name: group.name,
			};
		});

		console.log(groups);

		results.groups = groups
			.filter((group) => group.match <= 3)
			.sort((a, b) => {
				return a.match - b.match;
			});
	}

	if (userQuery.rows[0]) {
		const users = userQuery.rows.map((user) => {
			const includes =
				(user.hide_email
					? false
					: user.email
							.toLowerCase()
							.split("@")[0]
							.includes(query.toLowerCase())) ||
				user.username.toLowerCase().includes(query.toLowerCase());

			let match = user.hide_email
				? distance(query.toLowerCase(), user.username.toLowerCase())
				: distance(
						query.toLowerCase(),
						closest(query.toLowerCase(), [
							user.email.toLowerCase(),
							user.email.toLowerCase().split("@")[0],
							user.username.toLowerCase(),
						])
				  );

			if (includes && match > 1) {
				match = 1;
			}

			return {
				id: user.id_user,
				email: user.hide_email ? "" : user.email,
				username: user.username,
				avatar: user.avatar,
				hideEmail: user.hide_email,
				lastSeen: user.last_seen,
				match: match,
			};
		});

		results.users = users
			.filter((user) => user.match <= 3)
			.sort((a, b) => {
				return a.match - b.match;
			});
	}

	return results;
}

module.exports = { searchService };
