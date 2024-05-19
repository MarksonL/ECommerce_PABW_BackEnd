const { Product } = require("../models/index.js");

const createProduct2 = async (req, res) => {
  const { namaProduk, hargaProduk, stokProduk, statusProduk, description } = req.body;
  const imagesProduct = req.files.map(file => {
    // Membuat URL lengkap untuk gambar
    return `${req.protocol}://${req.get('host')}/${file.path.replace(/\\/g, '/')}`;
  });
  const user = req.user;

  try {
    // Buat produk baru dengan data yang diterima dari body permintaan
    const newProduct = await Product.create({
      namaProduk,
      hargaProduk,
      stokProduk,
      statusProduk,
      imagesProduct, // Simpan array URL lengkap gambar dalam kolom images
      id_user: user.id_user,
      description
    });

    return res.status(201).json({
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

// Fungsi untuk mendapatkan semua produk
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();

    return res.status(200).json({
      message: "Successfully retrieved all products",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Fungsi untuk mendapatkan semua produk berdasarkan ID pengguna
const getAllProductsByUserID = async (req, res) => {
  const user = req.user; // Ambil informasi pengguna dari objek permintaan

  try {
    const products = await Product.findAll({
      where: {
        id_user: user.id_user,
      },
    });

    return res.status(200).json({
      message: "Successfully retrieved products by user ID",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getProductById = async (req, res) => {
  const { id_product } = req.params
  try {
    const product = await Product.findByPk(id_product)
    return res.status(200).json({
      message: "Successfully retrieved product",
      data: product,
    })
  } catch (error) {
    console.log(error)
  }
}

const editProduct = async (req, res) => {
  const productId = req.params.id_product;
  const user = req.user;
  const { namaProduk, hargaProduk, stokProduk, statusProduk, description } = req.body;
  
  try {
    let imagesProduct;
    
    if (req.files && req.files.length > 0) {
      imagesProduct = req.files.map(file => file.filename);
    }

    const existingProduct = await Product.findByPk(productId);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (existingProduct.id_user !== user.id_user) {
      return res.status(403).json({ message: "You are not authorized to edit this product" });
    }

    // Gunakan metode update untuk memperbarui data produk
    await Product.update(
      {
        namaProduk: namaProduk || existingProduct.namaProduk,
        hargaProduk: hargaProduk || existingProduct.hargaProduk,
        stokProduk: stokProduk || existingProduct.stokProduk,
        statusProduk: statusProduk || existingProduct.statusProduk,
        imagesProduct: imagesProduct || existingProduct.imagesProduct, // Gunakan nilai default jika tidak ada gambar baru diunggah
        description: description || existingProduct.description, // Gunakan nilai default jika tidak ada gambar baru diunggah
      },
      {
        where: {
          id_product: productId,
        },
      }
    );

    // Ambil data produk yang telah diperbarui dari database
    const updatedProduct = await Product.findByPk(productId);

    return res.status(200).json({ message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};


const deleteProduct = async (req, res) => {
  const productId = req.params.id_product;
  const user = req.user;

  try {
    const existingProduct = await Product.findByPk(productId);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (existingProduct.id_user !== user.id_user) {
      return res.status(403).json({ message: "You are not authorized to delete this product" });
    }

    // Hapus produk dari database
    await Product.destroy({
      where: {
        id_product: productId,
      },
    });

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createProduct2,
  getAllProducts,
  getProductById,
  getAllProductsByUserID,
  editProduct,
  deleteProduct,
};
