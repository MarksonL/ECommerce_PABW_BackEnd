const express = require("express");
const { authenticateUser } = require("../middleware/authMiddleware");
const { editUserProfile } = require("../controllers/userController");
const userRoute = express.Router();

userRoute.patch('/edit-profile', authenticateUser, editUserProfile)


module.exports = userRoute;