require("dotenv").config();
const { Pool } = require("pg");

const connectionString =
	process.env.DATABASE_URL && `${process.env.DATABASE_URL}?sslmode=require`;
const dev = process.env.NODE_ENV !== "production";

const db =
	connectionString && !dev ? new Pool({ connectionString }) : new Pool();

db.on("error", (err, client) => {
	console.error("Unexpected error on idle client", err);
	process.exit(-1);
});

module.exports = { db };
