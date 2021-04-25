const express = require("express");
const app = express();

// Routes
const authRoutes = require("./routes/authRoutes");

const port = parseInt(process.env.PORT, 10) || 5000;

app.use("/", authRoutes);

app.listen(port, () => {
	console.log(`> Ready on http://localhost:${port}`);
});
