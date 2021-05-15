// Express
const express = require("express");
const router = express.Router();

// Controllers
const {
	getMembersController,
	getGroupsController,
	createGroupController,
	addAffiliationController,
	deleteGroupController
} = require("../controllers/groupController");

// Routes
router.post("/members", getMembersController);
router.post("/", getGroupsController);
router.post("/create", createGroupController);
router.post("/addAffiliation", addAffiliationController);
router.delete("/delete", deleteGroupController);

module.exports = router;
