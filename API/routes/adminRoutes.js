const express = require("express");
const { getAllLogs } = require("../controllers/logController");
const adminRoutes = express.Router();
const { authenticateUser, isAdmin } = require("../middleware/authMiddleware.js");
const { addUser, getAllUsers, getUserById, editUser, deleteUser, addSaldoElektronik } = require("../controllers/adminController.js");

adminRoutes.get("/logs", authenticateUser, isAdmin, getAllLogs);

adminRoutes.get("/users", authenticateUser, isAdmin, getAllUsers);

adminRoutes.get("/users/:id_user", authenticateUser, isAdmin, getUserById);

adminRoutes.post("/users", authenticateUser, isAdmin, addUser);

adminRoutes.post("/users/:id_user", authenticateUser, isAdmin, addSaldoElektronik);

adminRoutes.patch("/users/:id_user", authenticateUser, isAdmin, editUser);

adminRoutes.delete("/users/:id_user", authenticateUser, isAdmin, deleteUser);

module.exports = adminRoutes;