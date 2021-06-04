// Filesystem
const fs = require("fs");

// Database
const { db } = require("../config/db");

async function addAvatarService(decoded) {
	const idQuery = await db.query(
		`SELECT id_user, avatar, deleted FROM public."user" WHERE id_user = $1 AND deleted = FALSE`,
		[decoded.id]
	);

	if (idQuery.rows[0]) {
		if (!idQuery.rows[0].avatar) {
			await db.query(
				`UPDATE public.user SET avatar = TRUE WHERE id_user = $1`,
				[decoded.id]
			);
		}

		return false;
	}

	return true;
}

async function deleteAvatarService(decoded) {
	const idQuery = await db.query(
		`SELECT id_user, avatar, deleted FROM public."user" WHERE id_user = $1 AND avatar = TRUE AND deleted = FALSE`,
		[decoded.id]
	);

	if (idQuery.rows[0]) {
		await db.query(`UPDATE public.user SET avatar = FALSE WHERE id_user = $1`, [
			decoded.id,
		]);

		const files = await fs.promises.readdir("public/avatars/");

		for (const file of files) {
			if (file.split(".")[0] === decoded.id) {
				fs.promises.unlink(`public/avatars/${file}`);
				return false;
			}
		}
	}
	return true;
}

module.exports = { addAvatarService, deleteAvatarService };
