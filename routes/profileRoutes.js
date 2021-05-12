// Express
const express = require("express");
const router = express.Router();

// Controllers
const { profileController } = require("../controllers/profileController");

// Routes
router.get("/:id", profileController);

module.exports = router;
