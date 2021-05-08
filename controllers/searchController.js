const { searchService } = require("../models/searchService");

async function searchController(req, res) {
	try {
		const { error, result } = await searchService(
			req.body.query,
			req.headers.authorization
		);
		if (error === "unauthorized") {
			return res.status(401).json({ error, result });
		}
		if (error === "forbidden") {
			return res.status(403).json({ error, result });
		}
		return res.status(200).json({ error, result });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: "internal-server-error", result: [] });
	}
}

module.exports = { searchController };
