const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Routes

const exampleRoutes = require("./routes/exampleRoutes");

app.prepare().then(() => {
	const port = parseInt(process.env.PORT, 10) || 3000;
	const server = express();

	server.use("/", exampleRoutes);

	server.all("*", (req, res) => {
		return handle(req, res);
	});

	server.listen(port, (err) => {
		if (err) throw err;
		console.log(`> Ready on http://localhost:${port}`);
	});
});