// Express
const express = require("express");
const router = express.Router();

// Controllers
const {
	authGroupController,
	createGroupController,
	deleteGroupController,
	groupController,
	groupsController,
	updateGroupController,
} = require("../controllers/groupController");

// Middleware
const { authenticate } = require("../middlewares/authenticate");

// Routes
router.get("/auth/:id", authenticate, authGroupController);
router.post("/", authenticate, createGroupController);
router.delete("/:id", authenticate, deleteGroupController);
router.get("/:id", authenticate, groupController);
router.get("/", authenticate, groupsController);
router.put("/", authenticate, updateGroupController);

module.exports = router;
