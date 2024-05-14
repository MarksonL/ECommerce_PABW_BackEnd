const express = require('express');
const indexRoute = express.Router();
const authRoute = require('./authRoute');
const adminRoutes = require('./adminRoutes');
const productRoute = require('./productRoutes');
const cartRoute = require('./cartRoutes');
const orderRoutes = require('./orderRoutes');
const userRoutes = require('./userRoutes');


indexRoute.use(authRoute);
indexRoute.use('/admin', adminRoutes);
indexRoute.use('/products', productRoute);
indexRoute.use('/cart', cartRoute);
indexRoute.use('/order', orderRoutes);
indexRoute.use(userRoutes)

module.exports = indexRoute;
