// Express
const express = require("express");
const router = express.Router();

// Controllers
const { searchController } = require("../controllers/searchController");

// Routes
router.post("/", searchController);

module.exports = router;
