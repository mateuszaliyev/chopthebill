// .env
require("dotenv").config();

// Express
const express = require("express");
const router = express.Router();

// Multer
const multer = require("multer");

// JWT
const { verifyToken } = require("../utils/jwt");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/avatars/");
	},
	filename: function (req, file, cb) {
		const extension = file.originalname.split(".").pop();
		cb(null, `${getId(req.headers.authorization)}.${extension}`);
	},
});

const upload = multer({ storage });

function getId(authHeader) {
	const token = authHeader && authHeader.split(" ")[1];
	const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);

	return decoded.id;
}

// Controllers
const {
	avatarController,
	addAvatarController,
	deleteAvatarController,
} = require("../controllers/avatarController");

// Middlewares
const { authenticate } = require("../middlewares/authenticate");

// Routes
router.post("/new", authenticate, addAvatarController, upload.single("image"));
router.delete("/delete", authenticate, deleteAvatarController);
router.get("/:id", avatarController);

module.exports = router;
