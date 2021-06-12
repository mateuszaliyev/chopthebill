const { searchService } = require("../models/searchService");

async function searchController(req, res) {
	try {
		if (!req.body.query || req?.body?.query?.length < 3) {
			return res.sendStatus(400);
		}
		const results = await searchService(res.locals.decoded, req.body.query);
		return res.status(200).json(results);
	} catch (err) {
		console.error(err);
		return res.sendStatus(500);
	}
}

module.exports = { searchController };
