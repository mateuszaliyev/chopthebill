// Express
const express = require("express");
const router = express.Router();

// Routes
const authRoutes = require("./authRoutes");
const avatarRoutes = require("./avatarRoutes");

router.use("/", authRoutes);
router.use("/avatars", avatarRoutes);

module.exports = router;
