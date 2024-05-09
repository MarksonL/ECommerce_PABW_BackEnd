const express = require('express');
const orderRoutes = express.Router();
const { createOrder, getAllOrder } = require('../controllers/orderController');
const { authenticateUser } = require('../middleware/authMiddleware');

orderRoutes.get('/', authenticateUser, getAllOrder)
orderRoutes.post('/', authenticateUser, createOrder)

module.exports = orderRoutes;