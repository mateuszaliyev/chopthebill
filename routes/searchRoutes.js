// Express
const express = require("express");
const router = express.Router();

// Controllers
const { searchController } = require("../controllers/searchController");

// Middlewares
const { authenticate } = require("../middlewares/authenticate");

// Routes
router.post("/", authenticate, searchController);

module.exports = router;
