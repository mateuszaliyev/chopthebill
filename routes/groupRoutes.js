// Express
const express = require("express");
const router = express.Router();

// Controllers
const {
	getMembersController,
	getGroupsController,
	createGroupController,
	addAffiliationController,
	deleteGroupController,
	groupNameController,
	groupDescriptionController
} = require("../controllers/groupController");

// Routes
router.post("/members", getMembersController);
router.post("/", getGroupsController);
router.post("/create", createGroupController);
router.post("/addAffiliation", addAffiliationController);
router.delete("/delete", deleteGroupController);
router.put("/name", groupNameController);
router.put("/description", groupDescriptionController);

module.exports = router;
