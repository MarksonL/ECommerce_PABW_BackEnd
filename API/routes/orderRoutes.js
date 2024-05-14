const express = require('express');
const orderRoutes = express.Router();
const { createOrder, getAllOrder, getAllDetailOrdersByKurir, getAllDetailOrdersByProductOwner, editOrderDetailStatus, getAllOrderBuyer } = require('../controllers/orderController');
const { authenticateUser, isAdmin } = require('../middleware/authMiddleware');

orderRoutes.get('/', authenticateUser, isAdmin, getAllOrder)
orderRoutes.get('/history', authenticateUser,  getAllOrderBuyer)
orderRoutes.get('/me', authenticateUser, getAllDetailOrdersByProductOwner)
orderRoutes.get('/kurir', authenticateUser, getAllDetailOrdersByKurir)
orderRoutes.post('/', authenticateUser, createOrder)
orderRoutes.patch('/edit', authenticateUser, editOrderDetailStatus)

module.exports = orderRoutes;