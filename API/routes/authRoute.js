const express = require("express");
const authRoute = express.Router();
const { register, login, decodedToken, getMe, verifyEmail, sendVerificationEmail} = require("../controllers/authController.js");
const { isEmailExist, authenticateUser } = require("../middleware/authMiddleware.js");

authRoute.post("/register", isEmailExist, register);
authRoute.post("/login", login);
authRoute.post("/send-email-verif", sendVerificationEmail);
authRoute.get('/auth/verify-email', verifyEmail)
authRoute.post("/token", decodedToken)
authRoute.get("/auth/me", authenticateUser, getMe)

module.exports = authRoute;
