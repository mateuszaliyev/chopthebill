const { searchService } = require("../models/searchService");

async function searchController(req, res) {
	try {
		if (!req.body.query || req?.body?.query?.length < 3) {
			return res.status(400).json({ error: "bad-request", results: [] });
		}
		const { error, results } = await searchService(
			req.body.query,
			req.headers.authorization
		);
		if (error === "unauthorized") {
			return res.status(401).json({ error, results });
		}
		if (error === "forbidden") {
			return res.status(403).json({ error, results });
		}
		return res.status(200).json({ error, results });
	} catch (err) {
		console.log(err);
		return res
			.status(500)
			.json({ error: "internal-server-error", results: [] });
	}
}

module.exports = { searchController };
