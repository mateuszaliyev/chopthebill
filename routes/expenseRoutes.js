// Express
const express = require("express");
const router = express.Router();

// Controllers
const {
	addExpenseController,
	expenseController,
	expensesController,
	settleExpenseController,
	updateExpenseController,
} = require("../controllers/expenseController");

// Middlewares
const { authenticate } = require("../middlewares/authenticate");

// Routes
router.post("/", authenticate, addExpenseController);
router.get("/:id", authenticate, expenseController);
router.get("/", authenticate, expensesController);
router.put("/settle/:id", authenticate, settleExpenseController);
router.put("/:id", authenticate, updateExpenseController);

module.exports = router;
