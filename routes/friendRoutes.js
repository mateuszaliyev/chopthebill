// Express
const express = require("express");
const router = express.Router();

// Controllers
const { addFriendController } = require("../controllers/friendController");

// Routes
router.post("/", addFriendController);

module.exports = router;
