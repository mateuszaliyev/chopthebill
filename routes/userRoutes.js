// Express
const express = require("express");
const router = express.Router();

// Controllers
const {
	profileController,
	settingsController,
	passwordController,
	deleteController,
} = require("../controllers/userController");

// Routes
router.get("/user/:id", profileController);
router.put("/settings", settingsController);
router.put("/password", passwordController);
router.delete("/delete", deleteController);

module.exports = router;
