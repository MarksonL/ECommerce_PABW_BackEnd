const express = require("express");
const { authenticateUser } = require("../middleware/authMiddleware");
const { editUserProfile } = require("../controllers/userController");
const { getTransactionHistory } = require("../controllers/logController");
const userRoute = express.Router();

userRoute.patch('/edit-profile', authenticateUser, editUserProfile)
userRoute.get('/transaction-history', authenticateUser, getTransactionHistory)



module.exports = userRoute;