const { db } = require("../config/db")
const { User } = require("./pengguna")
const { Order } = require("./pesanan")
const { Product } = require("./produk")
const {OrderDetail} = require("./detailPesanan")
const {Cart} = require("./keranjang")

module.exports = {
    db,
    User,
    Order,
    Product,
    OrderDetail,
    Cart
}