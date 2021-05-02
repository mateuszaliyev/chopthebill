// Express
const express = require("express");
const router = express.Router();

// Controllers
const {
	registerController,
	loginController,
	accessController,
	refreshController,
	logoutController,
} = require("../controllers/authController");

// Routes
router.post("/register", registerController);
router.post("/login", loginController);
router.get("/access", accessController);
router.get("/refresh", refreshController);
router.delete("/logout", logoutController);

module.exports = router;
