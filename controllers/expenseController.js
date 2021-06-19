const {
	addExpenseService,
	expenseService,
	expensesService,
	settleExpenseService,
	updateExpenseService,
} = require("../models/expenseService");

async function addExpenseController(req, res) {
	try {
		const error = await addExpenseService(res.locals.decoded, req.body);
		if (error) {
			return res.status(400).json(error);
		}
		return res.sendStatus(201);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

async function expenseController(req, res) {
	try {
		const expense = await expenseService(res.locals.decoded, req.params.id);
		if (!expense) {
			return res.sendStatus(400);
		}
		return res.status(200).json(expense);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

async function expensesController(req, res) {
	try {
		const expenses = await expensesService(res.locals.decoded);
		if (!expenses) {
			return res.sendStatus(400);
		}
		return res.status(200).json(expenses);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

async function settleExpenseController(req, res) {
	try {
		const error = await settleExpenseService(res.locals.decoded, req.params.id);
		if (error) {
			return res.sendStatus(400);
		}
		return res.sendStatus(200);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

async function updateExpenseController(req, res) {
	try {
		const error = await updateExpenseService(res.locals.decoded, req.body);
		if (error) {
			return res.status(400).json(error);
		}
		return res.sendStatus(204);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

module.exports = {
	addExpenseController,
	expenseController,
	expensesController,
	settleExpenseController,
	updateExpenseController,
};
