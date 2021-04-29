// Express
const express = require("express");
const router = express.Router();

// Controllers
const {
	registerController,
	loginController,
	accessController,
} = require("../controllers/authController");

// Routes
router.post("/register", registerController);
router.post("/login", loginController);
router.get("/access", accessController);

module.exports = router;
