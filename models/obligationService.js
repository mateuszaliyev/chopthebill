// Config
const { db } = require("../config/db");

async function obligationsService(decoded) {
	const obligationQuery = await db.query(
		`
		SELECT o.id_obligation, o.amount, o.settled,
        d.id_user AS debtor_id, d.username AS debtor_username, d.avatar AS debtor_avatar,
        c.id_user AS creditor_id, c.username AS creditor_username, c.avatar AS creditor_avatar,
        o.id_expense, e.title AS title, e.currency AS currency
        FROM public.obligation o
        JOIN public.user d ON o.id_user_debtor = d.id_user
        JOIN public.user c ON o.id_user_creditor = c.id_user
        JOIN public.expense e ON o.id_expense = e.id_expense
        WHERE o.id_user_debtor = $1 OR o.id_user_creditor = $1;`,
		[decoded.id]
	);
	if (obligationQuery.rows[0]) {
		const obligations = obligationQuery.rows.map((obligation) => {
			return {
				id: obligation.id_obligation,
				amount: obligation.amount,
				settled: obligation.setteled,
				debtor: {
					id: obligation.debtor_id,
					username: obligation.debtor_username,
					avatar: obligation.debtor_avatar,
				},
				creditor: {
					id: obligation.creditor_id,
					username: obligation.creditor_username,
					avatar: obligation.creditor_avatar,
				},
				expense: {
					id: obligation.id_expense,
					title: obligation.title,
					currency: obligation.currency,
				},
			};
		});
		return obligations;
	}
	return null;
}

module.exports = { obligationsService };
