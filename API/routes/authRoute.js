const express = require("express");
const authRoute = express.Router();
const { register, login, decodedToken } = require("../controllers/authController.js");
const { isEmailExist } = require("../middleware/authMiddleware.js");

authRoute.post("/register", isEmailExist, register);
authRoute.post("/login", login);
authRoute.post("/token", decodedToken)

module.exports = authRoute;
