// Express
const express = require("express");
const router = express.Router();

// Controllers
const { avatarController } = require("../controllers/avatarController");

// Routes
router.get("/:id", avatarController);

module.exports = router;
