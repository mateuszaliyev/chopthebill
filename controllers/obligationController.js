const {
	obligationsService,
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

module.exports = { obligationsController };