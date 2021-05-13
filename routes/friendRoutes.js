// Express
const express = require("express");
const router = express.Router();

// Controllers
const {
	addFriendController,
	unfriendController,
} = require("../controllers/friendController");

// Routes
router.post("/", addFriendController);
router.delete("/", unfriendController);

module.exports = router;
