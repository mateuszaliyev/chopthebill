// Express
const express = require("express");
const router = express.Router();

// Controllers
const {
	addExpenseController,
	expensesController,
} = require("../controllers/expenseController");

// Middlewares
const { authenticate } = require("../middlewares/authenticate");

// Routes
router.get("/", authenticate, expensesController);
router.post("/", authenticate, addExpenseController);

module.exports = router;
