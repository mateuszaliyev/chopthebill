// Express
const express = require("express");
const router = express.Router();

// Controllers
const {
	addFriendController,
	unfriendController,
	friendsController,
} = require("../controllers/friendController");

// Routes
router.post("/", addFriendController);
router.delete("/", unfriendController);
router.get("/", friendsController);

module.exports = router;
