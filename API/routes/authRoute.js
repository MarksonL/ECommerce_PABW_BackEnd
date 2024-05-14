const express = require("express");
const authRoute = express.Router();
const { register, login, decodedToken, getMe } = require("../controllers/authController.js");
const { isEmailExist, authenticateUser } = require("../middleware/authMiddleware.js");

authRoute.post("/register", isEmailExist, register);
authRoute.post("/login", login);
authRoute.post("/token", decodedToken)
authRoute.get("/auth/me", authenticateUser, getMe)

module.exports = authRoute;