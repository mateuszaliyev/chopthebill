const path = require("path");

function avatarController(req, res) {
	res.sendFile(`/${req.params.id}`, {
		root: path.join(__dirname, "../public/avatars"),
	});
}

module.exports = { avatarController };
