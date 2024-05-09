const { db } = require("../config/db");
const { User } = require("./pengguna");
const { Order } = require("./pesanan");
const { Product } = require("./produk");
const { OrderDetail } = require("./detailPesanan");
const { Cart } = require("./keranjang");
const { logs } = require("./logs");
const { detailCart } = require("./detailKeranjang");

User.hasOne(Cart, { foreignKey: "id_user" });
Cart.belongsTo(User, { foreignKey: "id_user" });

User.hasMany(Product, { foreignKey: "id_user" });
Product.belongsTo(User, { foreignKey: "id_user" });

User.hasOne(Order, { foreignKey: "id_user" });
Order.belongsTo(User, { foreignKey: "id_user" });
Order.belongsTo(User, { foreignKey: "id_kurir", as: "kurir" });

Order.hasMany(OrderDetail, { foreignKey: "id_order" });
OrderDetail.belongsTo(Order, { foreignKey: "id_order" });
OrderDetail.belongsTo(Product, { foreignKey: "id_product" });

Cart.hasMany(detailCart, { foreignKey: "id_keranjang" });
detailCart.belongsTo(Cart, { foreignKey: "id_keranjang" });

Product.hasOne(detailCart, { foreignKey: "id_product" });
detailCart.belongsTo(Product, { foreignKey: "id_product" });

// detailCart.belongsTo(Cart, { foreignKey: 'id_keranjang' })
// User.hasMany(Cart, {
//     onDelete : "SET NULL"
// })

// Cart.belongsTo(User);

// User.hasMany(Order, {
//     onDelete : "SET NULL"
// })

// Order.belongsTo(User);

// User.hasMany(Product, {
//     onDelete : "SET NULL"
// })

// Product.belongsTo(User);

// Product.hasMany(Cart, {
//     onDelete : "SET NULL"
// })

// Cart.belongsTo(Product);

// Product.hasMany(OrderDetail, {
//     onDelete : "SET NULL"
// })

module.exports = {
  db,
  User,
  Order,
  Product,
  OrderDetail,
  Cart,
  logs,
  detailCart,
};
