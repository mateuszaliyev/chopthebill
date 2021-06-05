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

// Middlewares
const { authenticate } = require("../middlewares/authenticate");

// Routes
router.get("/user/:id", authenticate, profileController);
router.put("/settings", authenticate, settingsController);
router.put("/password", authenticate, passwordController);
router.delete("/delete", authenticate, deleteController);

module.exports = router;
