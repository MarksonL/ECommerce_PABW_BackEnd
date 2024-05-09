const express = require('express');
const cartRoute = express.Router();
const { authenticateUser } = require('../middleware/authMiddleware');
const {
  addItemToCart,
  getUserCart,
  removeItemFromCart,
  editItemInCart,
} = require('../controllers/cartController');

// Endpoint untuk menambahkan item ke keranjang
cartRoute.post('/', authenticateUser, addItemToCart);

// Endpoint untuk mendapatkan keranjang belanja pengguna
cartRoute.get('/', authenticateUser, getUserCart);

// Endpoint untuk menghapus item dari keranjang berdasarkan ID detail keranjang
cartRoute.delete('/:id_product', authenticateUser, removeItemFromCart);

cartRoute.patch('/edit', authenticateUser, editItemInCart);

module.exports = cartRoute;
