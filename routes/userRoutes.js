// Express
const express = require("express");
const router = express.Router();

// Controllers
const {
	profileController,
	settingsController,
} = require("../controllers/userController");

// Routes
router.get("/user/:id", profileController);
router.put("/settings", settingsController);

module.exports = router;
