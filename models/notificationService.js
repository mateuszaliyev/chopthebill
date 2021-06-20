// Config
const { db } = require("../config/db");

async function notificationsService(decoded) {
	const notificationQuery = await db.query(
		`
		SELECT *
		FROM public.notification
		WHERE id_user = $1
		ORDER BY id_notification`,
		[decoded.id]
	);

	if (!notificationQuery.rows[0]) {
		return [];
	}

	const firstUnreadIndex = notificationQuery.rows.findIndex(
		(notification) => !notification.read
	);

	if (firstUnreadIndex === -1) {
		return [];
	}

	let unread = 0;

	const notifications = notificationQuery.rows
		.slice(firstUnreadIndex)
		.map((notification) => ({
			description: notification.description,
			id: notification.id_notification,
			read: notification.read,
			redirect: notification.redirect,
			title: notification.title,
		}))
		.sort((a, b) => b.id - a.id)
		.filter((notification) => (unread++ >= 10 ? !notification.read : true));

	return notifications;
}

async function obligationNotificationService(decoded, notification) {
	if (decoded.id !== notification.creditor) {
		return true;
	}

	const authQuery = await db.query(
		`
		SELECT *
		FROM public.obligation
		WHERE id_obligation = $1 AND id_user_creditor = $2 AND id_user_debtor = $3 AND deleted = FALSE AND settled = FALSE`,
		[notification.obligation, notification.creditor, notification.debtor]
	);

	if (!authQuery.rows[0]) {
		return true;
	}

	await db.query(
		`
		INSERT INTO public.notification
		VALUES (DEFAULT, $1, $2, $3, FALSE, $4)`,
		[
			notification.title,
			notification.description,
			notification.redirect,
			notification.debtor,
		]
	);

	return false;
}

async function readNotificationService(decoded, id) {
	const authQuery = await db.query(
		`
		SELECT *
		FROM public.notification
		WHERE id_notification = $1 AND id_user = $2`,
		[id, decoded.id]
	);

	if (!authQuery.rows[0]) {
		return true;
	}

	await db.query(
		`
		UPDATE public.notification
		SET read = TRUE
		WHERE id_notification = $1`,
		[id]
	);

	return false;
}

module.exports = {
	notificationsService,
	obligationNotificationService,
	readNotificationService,
};
