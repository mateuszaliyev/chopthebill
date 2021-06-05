// Express
const express = require("express");
const router = express.Router();

// Routes
const authRoutes = require("./authRoutes");
const avatarRoutes = require("./avatarRoutes");
const expenseRoutes = require("./expenseRoutes");
const friendRoutes = require("./friendRoutes");
const searchRoutes = require("./searchRoutes");
const userRoutes = require("./userRoutes");

router.use("/", authRoutes);
router.use("/avatars", avatarRoutes);
router.use("/expenses", expenseRoutes);
router.use("/friend", friendRoutes);
router.use("/search", searchRoutes);
router.use("/", userRoutes);

module.exports = router;
