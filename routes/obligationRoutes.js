// Express
const express = require("express");
const router = express.Router();

// Controllers
const {
    obligationsController
} = require("../controllers/obligationController");

// Middlewares
const { authenticate } = require("../middlewares/authenticate");

// Routes
router.get("/", authenticate, obligationsController);

module.exports = router;