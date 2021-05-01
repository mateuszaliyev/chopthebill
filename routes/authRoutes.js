// Express
const express = require("express");
const router = express.Router();

// Controllers
const {
	registerController,
	loginController,
	accessController,
	refreshController,
} = require("../controllers/authController");

// Routes
router.post("/register", registerController);
router.post("/login", loginController);
router.get("/access", accessController);
router.get("/refresh", refreshController);

module.exports = router;
