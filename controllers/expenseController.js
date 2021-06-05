const {
	addExpenseService,
	expensesService,
} = require("../models/expenseService");

async function addExpenseController(req, res) {
	try {
		const error = await addExpenseService(req.body);
		if (error) {
			return res.sendStatus(400);
		}
		return res.sendStatus(201);
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

module.exports = { addExpenseController, expensesController };
