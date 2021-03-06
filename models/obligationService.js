// Config
const { db } = require("../config/db");

async function obligationsService(decoded) {
	const obligationQuery = await db.query(
		`
		SELECT o.id_obligation, o.amount, o.settled,
        d.id_user AS debtor_id, d.username AS debtor_username, d.language AS debtor_language, d.avatar AS debtor_avatar,
        c.id_user AS creditor_id, c.username AS creditor_username, c.language AS creditor_langugage, c.avatar AS creditor_avatar,
        o.id_expense, e.title AS title, e.currency AS currency, e.settled AS expense_settled
        FROM public.obligation o
        JOIN public.user d ON o.id_user_debtor = d.id_user
        JOIN public.user c ON o.id_user_creditor = c.id_user
        JOIN public.expense e ON o.id_expense = e.id_expense
        WHERE o.id_user_debtor = $1 OR o.id_user_creditor = $1 AND e.deleted = FALSE AND o.deleted = FALSE`,
		[decoded.id]
	);
	if (obligationQuery.rows[0]) {
		const obligations = obligationQuery.rows.map((obligation) => {
			return {
				amount: obligation.amount,
				creditor: {
					avatar: obligation.creditor_avatar,
					id: obligation.creditor_id,
					language: obligation.creditor_language,
					username: obligation.creditor_username,
				},
				debtor: {
					avatar: obligation.debtor_avatar,
					id: obligation.debtor_id,
					language: obligation.debtor_language,
					username: obligation.debtor_username,
				},
				expense: {
					id: obligation.id_expense,
					title: obligation.title,
					currency: obligation.currency,
					settled: obligation.expense_settled,
				},
				id: obligation.id_obligation,
				settled: obligation.settled,
			};
		});
		return obligations;
	}
	return [];
}

async function settleObligationService(decoded, id, settle) {
	const authQuery = await db.query(
		`
		SELECT settled
		FROM public.obligation
		WHERE id_obligation = $1 AND id_user_creditor = $2 AND deleted = FALSE`,
		[id, decoded.id]
	);

	if (!authQuery.rows[0]) {
		return true;
	}

	await db.query(
		`
		UPDATE public.obligation
		SET settled = $1
		WHERE id_obligation = $2`,
		[settle, id]
	);

	return false;
}

module.exports = { obligationsService, settleObligationService };
