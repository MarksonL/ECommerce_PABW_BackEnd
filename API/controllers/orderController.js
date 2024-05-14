const {
  Cart,
  detailCart,
  Product,
  User,
  Order,
  OrderDetail,
} = require("../models/index");

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

const getAllOrderBuyer = async (req, res) => {
  const userId = req.user.id_user
  try {
    // Ambil semua pesanan beserta detailnya
    const orders = await Order.findAll({
      where: { id_user : userId },
      include: {
        model: OrderDetail,
        include: {
          model: Product
        }
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
  let { selectedItems, kurirId } = req.body; // Tambahan kurirId dari body

  try {
    // Pemeriksaan apakah alamat dan nomor telepon pengguna telah diisi
    if (!user.alamat || !user.nomorTelepon) {
      return res
        .status(400)
        .json({ message: "Please provide address and phone number" });
    }

    const cart = await findUserCart(user.id_user);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const totalPrice = await calculateTotalPrice(cart, selectedItems); // Hitung total harga pesanan

    // Verifikasi saldo elektronik pengguna
    const userBalance = await getUserBalance(user.id_user);

    // Cek stok produk
    const isStockAvailable = await checkProductStock(cart.detail_carts, selectedItems);
    if (!isStockAvailable) {
      return res.status(400).json({ message: "Not enough stock for some products" });
    }

    if (userBalance >= totalPrice) {
      // Jika saldo cukup, lakukan transaksi pembayaran
      const order = await createNewOrder(user.id_user, kurirId);
      await processPayment(user.id_user, totalPrice);

      await saveOrderDetails(order.id_order, cart.detail_carts, selectedItems);

      // Mengurangi stok produk terkait
      await reduceProductStock(cart.detail_carts, selectedItems);

      await updateOrderTotalPrice(order.id_order, totalPrice);
      await removeSelectedItemsFromCart(cart.id_keranjang, selectedItems);

      return res.status(201).json({ message: "Order created successfully" });
    } else {
      // Jika saldo tidak cukup, simpan detail pesanan sebagai transaksi gagal
      const order = await createNewOrder(user.id_user, kurirId);
      await saveFailedTransaction(
        order.id_order,
        cart.detail_carts,
        selectedItems
      );
      await updateOrderTotalPrice(order.id_order, totalPrice);
      return res
        .status(400)
        .json({ message: "Insufficient balance for payment" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const checkProductStock = async (cartItems, selectedItems) => {
  try {
    for (const cartItem of cartItems) {
      if (selectedItems.includes(cartItem.id_product)) {
        const product = await Product.findByPk(cartItem.id_product);
        if (!product || product.stock < cartItem.jumlah_barang) {
          return false; // Jika stok tidak mencukupi untuk produk yang dipilih, kembalikan false
        }
      }
    }
    return true; // Jika semua stok mencukupi, kembalikan true
  } catch (error) {
    console.error("Error checking product stock:", error);
    throw error;
  }
};

const reduceProductStock = async (cartItems, selectedItems) => {
  try {
    // Loop through each cart item
    for (const cartItem of cartItems) {
      // Check if the cart item is selected
      if (selectedItems.includes(cartItem.id_product)) {
        // Get the product corresponding to the cart item
        const product = await Product.findByPk(cartItem.id_product);

        // Calculate the new stock after deduction
        const newStock = product.stokProduk - cartItem.jumlah_barang;

        // Update the stock of the product
        await Product.update(
          { stokProduk: newStock },
          { where: { id_product: cartItem.id_product } }
        );
      }
    }
  } catch (error) {
    console.error("Error reducing product stock:", error);
    throw error;
  }
};

const processPayment = async (userId, amount) => {
  // Mengurangi saldo elektronik pengguna
  await User.update(
    { saldoElektronik: (await getUserBalance(userId)) - amount },
    { where: { id_user: userId } }
  );
};

const getUserBalance = async (userId) => {
  const user = await User.findByPk(userId);
  return user ? user.saldoElektronik : 0; // Default 0 jika user tidak ditemukan
};

const createNewOrder = async (userId, kurirId) => {
  // Tambahkan parameter kurirId
  return await Order.create({
    orderDate: new Date(),
    totalPrice: 0,
    id_user: userId,
    id_kurir: kurirId, // Set id_kurir sesuai dengan kurirId yang diterima dari body
  });
};

const createOrderDetail = async (orderId, cartItem, status) => {
  await OrderDetail.create({
    orderDate: new Date(),
    jumlahBarang: cartItem.jumlah_barang,
    total_harga: cartItem.jumlah_barang * cartItem.product.hargaProduk,
    status: status,
    id_order: orderId,
    id_product: cartItem.id_product,
  });
};

const saveOrderDetails = async (orderId, cartItems, selectedItems) => {
  console.log("save", selectedItems);
  try {
    for (const item of selectedItems) {
      for (const cartItem of cartItems) {
        if (item === cartItem.id_product) {
          await createOrderDetail(orderId, cartItem, "menunggu penjual");
        }
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const saveFailedTransaction = async (orderId, cartItems, selectedItems) => {
  console.log("failed", selectedItems);
  try {
    for (const item of selectedItems) {
      for (const cartItem of cartItems) {
        if (item === cartItem.id_product) {
          await createOrderDetail(orderId, cartItem, "transaksi gagal");
        }
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const findUserCart = async (userId) => {
  const cart = await Cart.findOne({
    where: { id_user: userId },
    include: { model: detailCart, include: { model: Product } },
  });

  if (!cart) {
    return null;
  }

  // Ubah hasil ke bentuk objek JSON
  const cartJSON = cart.toJSON();

  console.log(cartJSON);

  return cartJSON;
};

const calculateTotalPrice = async (cart, selectedItems) => {
  console.log("calculateTotalPrice", typeof selectedItems);
  let totalPrice = 0;
  try {
    for (const item of selectedItems) {
      for (const cartItem of cart.detail_carts) {
        if (item === cartItem.id_product) {
          totalPrice += cartItem.jumlah_barang * cartItem.product.hargaProduk;
        }
      }
    }
    return totalPrice;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateOrderTotalPrice = async (orderId, totalPrice) => {
  await Order.update({ totalPrice }, { where: { id_order: orderId } });
};

const removeSelectedItemsFromCart = async (cartId, selectedItems) => {
  console.log("remove", typeof selectedItems);
  try {
    // Hapus detail keranjang dengan ID produk yang ada dalam array selectedItems
    for (item of selectedItems) {
      console.log(item);
      await detailCart.destroy({
        where: {
          id_keranjang: cartId,
          id_product: item, // Gunakan langsung nilai selectedItems tanpa tanda kurung siku
        },
      });
    }

    return; // Tidak ada error, kembalikan null
  } catch (error) {
    console.error(error);
    throw error; // Lepaskan error untuk ditangani di level yang lebih tinggi
  }
};

const editOrderDetailStatus = async (req, res) => {
  const { orderDetailId, newStatus } = req.body;
  const userRole = req.user.role;
  const userId = req.user.id_user;

  try {
    // Temukan detail pesanan berdasarkan ID
    const orderDetail = await OrderDetail.findByPk(orderDetailId);

    if (!orderDetail) {
      return res.status(404).json({ message: "Order detail not found" });
    }

    // Dapatkan status pesanan sebelumnya
    const currentStatus = orderDetail.status;
    const barangPesanan = orderDetail.id_product;

    const productDetail = await Product.findByPk(barangPesanan);
    const userPenjual = productDetail.id_user;

    const dataOrder = await Order.findByPk(orderDetail.id_order);
    const userKurir = dataOrder.id_kurir;
    const userPembeli = dataOrder.id_user;

    const roleCheck = checkPermission(
      userRole,
      currentStatus,
      newStatus,
      userId,
      userKurir,
      userPenjual,
      userPembeli
    );

    // Periksa izin untuk mengubah status pesanan
    if (roleCheck) {
      await OrderDetail.update(
        { status: newStatus },
        { where: { id_detailPesanan: orderDetailId } }
      );

      // Jika status pesanan menjadi "diterima pembeli", tambahkan saldo elektronik kepada penjual
      if (newStatus === "diterima pembeli") {
        await addBalanceToSeller(barangPesanan);
      }

      // Jika status pesanan menjadi "dikomplain", kembalikan uang pembeli ke saldo elektroniknya
      if (newStatus === "dikomplain") {
        await returnMoneyToBuyer(orderDetail, userPembeli);
      }

      return res
        .status(200)
        .json({ message: "Order detail status updated successfully" });
    } else {
      return res
        .status(403)
        .json({ message: "Unauthorized to change order status" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const returnMoneyToBuyer = async (orderDetail, userPembeli) => {
  try {
    // Get order details
    const product = await Product.findByPk(orderDetail.id_product);
    const totalPrice = orderDetail.jumlahBarang * product.hargaProduk;

    // Return the total price to the buyer's electronic balance
    await User.increment('saldoElektronik', {
      by: totalPrice,
      where: { id_user: userPembeli }
    });
  } catch (error) {
    console.error("Error returning money to buyer:", error);
    throw error;
  }
};

const addBalanceToSeller = async (productId) => {
  try {
    // Get product details
    const product = await Product.findByPk(productId);

    // Add the product price to the seller's electronic balance
    await User.increment('saldoElektronik', {
      by: product.hargaProduk,
      where: { id_user: product.id_user }
    });
  } catch (error) {
    console.error("Error adding balance to seller:", error);
    throw error;
  }
};

const checkPermission = (
  userRole,
  currentStatus,
  newStatus,
  userId,
  kurirId,
  userPenjual,
  userPembeli
) => {
  // Objek yang berisi daftar status yang diizinkan untuk setiap peran pengguna
  const allowedStatus = {
    "ADMIN": {
      "menunggu penjual": ["diproses penjual"],
      "diproses penjual": ["menunggu kurir"],
      "menunggu kurir": ["sedang dikirim"],
      "sedang dikirim": ["sampai di tujuan"],
      "sampai di tujuan": ["diterima pembeli", "dikomplain"],
      "diterima pembeli": [],
      "dikomplain": ["dikirim balik", "transaksi gagal"],
      "dikirim balik": ["transaksi gagal"],
      "transaksi gagal": [],
    },
    "PENGGUNA": {
      "menunggu penjual": ["diproses penjual"],
      "diproses penjual": ["menunggu kurir"],
      "sampai di tujuan": ["diterima pembeli", "dikomplain"],
      "dikirim balik": ["transaksi gagal"],
      "diterima pembeli": [],
    },
    "KURIR": {
      "menunggu kurir": ["sedang dikirim"],
      "sedang dikirim": ["sampai di tujuan"],
      "dikomplain": ["dikirim balik"],
    }
  };

  if (userRole === "ADMIN") {
    return true; // Admin dapat mengubah semua status
  } else if ( userRole === "PENGGUNA" &&
    allowedStatus[userRole] &&
    allowedStatus[userRole][currentStatus] &&
    allowedStatus[userRole][currentStatus].includes(newStatus) && userId === userPenjual || userId === userPembeli
  ) {
    return true; // Jika tidak memenuhi kriteria di atas, pengguna tidak diizinkan
  } else if ( userRole === "KURIR" &&
    allowedStatus[userRole] &&
    allowedStatus[userRole][currentStatus] &&
    allowedStatus[userRole][currentStatus].includes(newStatus) && userId === kurirId
  ) {
    return true; // Jika tidak memenuhi kriteria di atas, pengguna tidak diizinkan
  } else {
    return false
  }
  
};


const getAllDetailOrdersByProductOwner = async (req, res) => {
  const userId = req.user.id_user;

  try {
    // Ambil semua pesanan yang memiliki produk yang dimiliki oleh penjual
    const orders = await Order.findAll({
      include: {
          model: OrderDetail,
          include: {
            model: Product,
            where: { id_user: userId }, // Filter berdasarkan id_penjual (penjual)
          },
        },
    });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllDetailOrdersByKurir = async (req, res) => {
  const userId = req.user.id_user;

  try {
    // Ambil semua pesanan yang memiliki produk yang dimiliki oleh penjual
    const orders = await Order.findAll({
      where: { id_kurir: userId },
      include: {
        model: OrderDetail,
        include: {
          model: Product,
        },
      },
    });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllDetailOrdersByProductOwner,
  getAllDetailOrdersByKurir,
  editOrderDetailStatus,
  getAllOrder,
  getAllOrderBuyer,
  createOrder,
};
