// Express
const express = require("express");
const router = express.Router();

// Routes
const authRoutes = require("./authRoutes");
const avatarRoutes = require("./avatarRoutes");
const expenseRoutes = require("./expenseRoutes");
const friendRoutes = require("./friendRoutes");
const groupRoutes = require("./groupRoutes");
const obligationRoutes = require("./obligationRoutes");
const searchRoutes = require("./searchRoutes");
const userRoutes = require("./userRoutes");

router.use("/", authRoutes);
router.use("/avatars", avatarRoutes);
router.use("/expenses", expenseRoutes);
router.use("/friends", friendRoutes);
router.use("/groups", groupRoutes);
router.use("/obligations", obligationRoutes);
router.use("/search", searchRoutes);
router.use("/", userRoutes);

module.exports = router;
