const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;
const dev = process.env.NODE_ENV !== "production";

const db =
	connectionString && !dev
		? new Pool({
				connectionString,
				ssl: {
					rejectUnauthorized: false,
				},
		  })
		: new Pool();

db.on("error", (err, client) => {
	console.error("Unexpected error on idle client", err);
	process.exit(-1);
});

module.exports = { db };
