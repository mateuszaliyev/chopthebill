// Express
const express = require("express");
const router = express.Router();

// Controllers
const {
	addFriendController,
	unfriendController,
	friendsController,
} = require("../controllers/friendController");

// Middlewares
const { authenticate } = require("../middlewares/authenticate");

// Routes
router.post("/", authenticate, addFriendController);
router.delete("/", authenticate, unfriendController);
router.get("/", authenticate, friendsController);

module.exports = router;
