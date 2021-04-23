function register(req, res) {
	console.log(req.body.password);
	res.status(201).send();
}

module.exports = { register };
