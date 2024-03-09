const {db} = require("../config/db");
const { User } = require("./pengguna")
const { Order } = require("./pesanan")
const { Product } = require("./produk")
const {OrderDetail} = require("./detailPesanan")
const {Cart} = require("./keranjang")

User.hasMany(Cart, {
    onDelete : "SET NULL"
})

Cart.belongsTo(User);

User.hasMany(Order, {
    onDelete : "SET NULL"
})

Order.belongsTo(User);

User.hasMany(Product, {
    onDelete : "SET NULL"
})

Product.belongsTo(User);

Product.hasMany(Cart, {
    onDelete : "SET NULL"
})

Cart.belongsTo(Product);

Product.hasMany(OrderDetail, {
    onDelete : "SET NULL"
})

module.exports = {
    db,
    User,
    Order,
    Product,
    OrderDetail,
    Cart
}