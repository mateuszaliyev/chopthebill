// .env
require("dotenv").config();

// Express
const express = require("express");
const cors = require("cors");
const app = express();

// Middlewares
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.static("public"));

// Routes
const routes = require("./routes/");

const port = parseInt(process.env.PORT, 10) || 5000;

app.use("/", routes);

app.listen(port, () => {
	console.log(`> Ready on http://localhost:${port}`);
});
