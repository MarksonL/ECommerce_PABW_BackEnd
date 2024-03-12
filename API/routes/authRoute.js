const express = require("express");
const authRoute = express.Router();
const { register, login } = require("../controllers/authController.js");
const { isEmailExist } = require("../middleware/authMiddleware.js");

authRoute.post("/register", isEmailExist, register);
authRoute.post("/login", login);

module.exports = authRoute;
