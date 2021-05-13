// Express
const express = require("express");
const router = express.Router();

// Routes
const authRoutes = require("./authRoutes");
const avatarRoutes = require("./avatarRoutes");
const searchRoutes = require("./searchRoutes");
const userRoutes = require("./userRoutes");
const friendRoutes = require("./friendRoutes");

router.use("/", authRoutes);
router.use("/avatars", avatarRoutes);
router.use("/search", searchRoutes);
router.use("/", userRoutes);
router.use("/friend", friendRoutes);

module.exports = router;
