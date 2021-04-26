// Environment variables (.env)
require("dotenv").config();

// Express
const express = require("express");
const cors = require("cors");
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");

const port = parseInt(process.env.PORT, 10) || 5000;

app.use("/", authRoutes);

app.listen(port, () => {
	console.log(`> Ready on http://localhost:${port}`);
});
