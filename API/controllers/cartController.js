const { Cart, detailCart, Product } = require("../models/index.js");

// Fungsi untuk menemukan atau membuat keranjang baru untuk pengguna
const findOrCreateCart = async (userId) => {
  const result = await Cart.findOrCreate({
    where: { id_user: userId },
    defaults: { total_price: 0 },
  });
  return result[0];
};

// Fungsi untuk menghitung total harga keranjang
const calculateTotalPrice = async (cartId) => {
  const cartItems = await detailCart.findAll({
    where: { id_keranjang: cartId },
    include: Product,
  });

  return cartItems.reduce((total, item) => {
    return total + item.jumlah_barang * item.product.hargaProduk;
  }, 0);
};

// Fungsi untuk menambahkan item ke dalam keranjang
const addItemToCart = async (req, res) => {
  const { id_product, jumlah_barang } = req.body;
  const user = req.user;
  let quantity = parseInt(jumlah_barang)

  try {
    const cart = await findOrCreateCart(user.id_user);

    let detail = await detailCart.findOrCreate({
      where: { id_keranjang: cart.id_keranjang, id_product },
      defaults: { jumlah_barang : 0 },
    });
    detail = detail[0];
    
    if (!detail[1]) {
      console.log(detail.jumlah_barang += quantity);
      await detail.save();
    }

    let totalPrice = await calculateTotalPrice(cart.id_keranjang);

    await Cart.update(
      { total_price: totalPrice },
      { where: { id_keranjang: cart.id_keranjang } }
    );

    return res.status(200).json({ message: "Item added to cart successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Fungsi untuk mendapatkan keranjang belanja pengguna
const getUserCart = async (req, res) => {
  const user = req.user;

  try {
    const cart = await Cart.findOne({
      where: { id_user: user.id_user },
      include: { model: detailCart, include: Product },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res
      .status(200)
      .json({ message: "User cart retrieved successfully", data: cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Fungsi untuk menghapus item dari keranjang
const removeItemFromCart = async (req, res) => {
  const { id_product } = req.params;
  const user = req.user;

  try {
    const detail = await detailCart.findOne({
      where: { id_product },
      include: { model: Cart, where: { id_user: user.id_user } },
    });

    if (!detail) {
      return res.status(404).json({ message: "Item not found" });
    }

    await detail.destroy();

    const cart = await Cart.findOne({
      where: { id_keranjang: detail.id_keranjang },
      include: { model: detailCart, include: Product },
    });

    const totalPrice = await calculateTotalPrice(cart.id_keranjang);

    await Cart.update(
      { total_price: totalPrice },
      { where: { id_keranjang: detail.id_keranjang } }
    );

    return res
      .status(200)
      .json({ message: "Item removed from cart successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Fungsi untuk mengedit jumlah barang dalam keranjang
const editItemInCart = async (req, res) => {
  const { id_product, jumlah_barang } = req.body;
  const user = req.user;

  try {
    // Cari detail keranjang untuk produk yang akan diubah
    const detail = await detailCart.findOne({
      where: { id_product },
      include: { model: Cart, where: { id_user: user.id_user } },
    });

    if (!detail) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Perbarui jumlah barang
    detail.jumlah_barang = jumlah_barang;
    await detail.save();

    // Ambil total harga keranjang setelah perubahan
    const cart = await Cart.findOne({
      where: { id_keranjang: detail.id_keranjang },
      include: { model: detailCart, include: Product },
    });

    const totalPrice = await calculateTotalPrice(cart.id_keranjang);

    // Update total harga pada tabel Cart
    await Cart.update(
      { total_price: totalPrice },
      { where: { id_keranjang: detail.id_keranjang } }
    );

    return res.status(200).json({ message: "Cart updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addItemToCart,
  getUserCart,
  removeItemFromCart,
  editItemInCart,
};
