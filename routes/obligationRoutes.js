// Express
const express = require("express");
const router = express.Router();

// Controllers
const {
	obligationsController,
	settleObligationController,
} = require("../controllers/obligationController");

// Middlewares
const { authenticate } = require("../middlewares/authenticate");

const revoke = (req, res, next) => {
	res.locals.settle = false;
	next();
};

const settle = (req, res, next) => {
	res.locals.settle = true;
	next();
};

// Routes
router.get("/", authenticate, obligationsController);
router.put("/revoke/:id", authenticate, revoke, settleObligationController);
router.put("/settle/:id", authenticate, settle, settleObligationController);

module.exports = router;
