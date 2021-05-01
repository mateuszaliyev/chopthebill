// Environment variables (.env)
require("dotenv").config();

// Express
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

// Middlewares
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());

// Routes
const routes = require("./routes/");

const port = parseInt(process.env.PORT, 10) || 5000;

app.use("/", routes);

app.listen(port, () => {
	console.log(`> Ready on http://localhost:${port}`);
});
