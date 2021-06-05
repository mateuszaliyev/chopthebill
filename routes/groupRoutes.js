// Express
const express = require("express");
const router = express.Router();

// Controllers
const {
	getMembersController,
	getGroupsController,
	createGroupController,
	deleteGroupController,
	groupNameController,
	groupDescriptionController,
	deleteMemberController,
	addMemberController
} = require("../controllers/groupController");

// Routes
router.post("/", getGroupsController);
router.post("/create", createGroupController);
router.delete("/delete", deleteGroupController);
router.put("/name", groupNameController);
router.put("/description", groupDescriptionController);
router.post("/members", getMembersController);
router.post("/member/delete", deleteMemberController);
router.post("/member/add", addMemberController);

module.exports = router;
