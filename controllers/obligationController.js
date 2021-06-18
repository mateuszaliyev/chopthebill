const {
	obligationsService,
	settleObligationService,
} = require("../models/obligationService");

async function obligationsController(req, res) {
	try {
		const obligations = await obligationsService(res.locals.decoded);
		if (!obligations) {
			return res.sendStatus(400);
		}
		return res.status(200).json(obligations);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

async function settleObligationController(req, res) {
	try {
		const error = await settleObligationService(
			res.locals.decoded,
			req.params.id,
			res.locals.settle
		);
		if (error) {
			return res.sendStatus(400);
		}
		return res.sendStatus(204);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

module.exports = { obligationsController, settleObligationController };
