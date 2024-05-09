const { Cart, detailCart, Product, User, Order, OrderDetail } = require('../models/index')

const getAllOrder = async (req, res) => {
  try {
    // Ambil semua pesanan beserta detailnya
    const orders = await Order.findAll({
      include: {
        model: OrderDetail,
      },
    });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const createOrder = async (req, res) => {
  const user = req.user;
  const { selectedItems, kurirId } = req.body; // Tambahan kurirId dari body

  try {
    const cart = await findUserCart(user.id_user);


    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const totalPrice = await calculateTotalPrice(cart, selectedItems); // Hitung total harga pesanan

    // Verifikasi saldo elektronik pengguna
    const userBalance = await getUserBalance(user.id_user);
    // console.log(userBalance)

    // Buat pesanan baru dan simpan detail pesanan
    const order = await createNewOrder(user.id_user, kurirId);
    
    if (userBalance >= totalPrice) {
      // Jika saldo cukup, lakukan transaksi pembayaran
      await processPayment(user.id_user, totalPrice);
      
      await saveOrderDetails(order.id_order, cart.detail_carts, selectedItems);

      await updateOrderTotalPrice(order.id_order, totalPrice);
      await removeSelectedItemsFromCart(cart.id_keranjang, selectedItems);
      
      return res.status(201).json({ message: "Order created successfully" });
    } else {
      // Jika saldo tidak cukup, simpan detail pesanan sebagai transaksi gagal
      await saveFailedTransaction(order.id_order, cart.detail_carts, selectedItems);
      await updateOrderTotalPrice(order.id_order, totalPrice);
      return res.status(400).json({ message: "Insufficient balance for payment" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const processPayment = async (userId, amount) => {
  // Mengurangi saldo elektronik pengguna
  await User.update(
    { saldoElektronik: await getUserBalance(userId) - amount },
    { where: { id_user: userId } }
  );
};

const getUserBalance = async (userId) => {
  const user = await User.findByPk(userId);
  return user ? user.saldoElektronik : 0; // Default 0 jika user tidak ditemukan
};

const createNewOrder = async (userId, kurirId) => { // Tambahkan parameter kurirId
  return await Order.create({
    orderDate: new Date(),
    totalPrice: 0,
    id_user: userId,
    id_kurir: kurirId // Set id_kurir sesuai dengan kurirId yang diterima dari body
  });
};

const saveOrderDetails = async (orderId, cartItems, selectedItems) => {
  for (const cartItem of cartItems) {
    if (selectedItems.includes(cartItem.id_product.toString())) {
      await OrderDetail.create({
        orderDate: new Date(),
        jumlahBarang: cartItem.jumlah_barang,
        total_harga: cartItem.jumlah_barang * cartItem.product.hargaProduk,
        status: "menunggu penjual",
        id_order: orderId,
        id_product: cartItem.id_product,
      });
    }
  }
};

const saveFailedTransaction = async (orderId, cartItems, selectedItems) => {
  for (const cartItem of cartItems) {
    if (selectedItems.includes(cartItem.id_product.toString())) {
      await OrderDetail.create({
        orderDate: new Date(),
        jumlahBarang: cartItem.jumlah_barang,
        total_harga: cartItem.jumlah_barang * cartItem.product.hargaProduk,
        status: "transaksi gagal",
        id_order: orderId, // Tidak ada pesanan terkait
        id_product: cartItem.id_product,
      });
    }
  }
};

const findUserCart = async (userId) => {
  const cart = await Cart.findOne({
    where: { id_user: userId },
    include: { model: detailCart, include: { model : Product}, },
  });

  if (!cart) {
    return null;
  }

  // Ubah hasil ke bentuk objek JSON
  const cartJSON = cart.toJSON();

  console.log(cartJSON)

  return cartJSON;
};


const calculateTotalPrice = async (cart, selectedItems) => {
  let totalPrice = 0;
  for (const cartItem of cart.detail_carts) {
    if (selectedItems.includes(cartItem.id_product.toString())) {
      totalPrice += cartItem.jumlah_barang * cartItem.product.hargaProduk;
    }
  }
  return totalPrice;
};

const updateOrderTotalPrice = async (orderId, totalPrice) => {
  await Order.update(
    { totalPrice },
    { where: { id_order: orderId } }
  );
};

const removeSelectedItemsFromCart = async (cartId, selectedItems) => {
  // Ubah array selectedItems menjadi array ID produk yang hanya berisi nilai unik
  const productIds = [...new Set(selectedItems)];

  // Hapus detail keranjang dengan ID produk yang ada dalam array productIds
  await detailCart.destroy({
    where: {
      id_keranjang: cartId,
      id_product: productIds,
    },
  });
};


module.exports = {
  getAllOrder,
  createOrder,
};
