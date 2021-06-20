// Express
const express = require("express");
const router = express.Router();

// Controllers
const {
	notificationsController,
	obligationNotificationController,
	readNotificationController,
} = require("../controllers/notificationController");

// Middlewares
const { authenticate } = require("../middlewares/authenticate");

// Routes
router.get("/", authenticate, notificationsController);
router.post("/obligation/:id", authenticate, obligationNotificationController);
router.delete("/:id", authenticate, readNotificationController);

module.exports = router;
