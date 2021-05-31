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
	forgotPasswordController,
	validateLinkController,
	resetPasswordController,
} = require("../controllers/authController");

// Middlewares
const { authenticate } = require("../middlewares/authenticate");

// Routes
router.post("/register", registerController);
router.post("/login", loginController);
router.get("/access", authenticate, accessController);
router.get("/refresh", refreshController);
router.delete("/logout", authenticate, logoutController);
router.post("/forgot-password", forgotPasswordController);
router.post("/validate-link", validateLinkController);
router.post("/reset-password", resetPasswordController);

module.exports = router;
