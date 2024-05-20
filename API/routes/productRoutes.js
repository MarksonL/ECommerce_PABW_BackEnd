const express = require("express");
const productRoute = express.Router();
const {
  createProduct2,
  getAllProducts,
  getAllProductsByUserID,
  editProduct,
  deleteProduct,
  getProductById
} = require("../controllers/productController.js");
const { authenticateUser } = require("../middleware/authMiddleware.js");
const upload = require("../middleware/multer.js");

productRoute.post("/", authenticateUser, upload.array('imagesProduct', 5) ,createProduct2);

productRoute.get("/", getAllProducts);

productRoute.get("/me", authenticateUser, getAllProductsByUserID);

productRoute.get("/:id_product", getProductById);

productRoute.patch("/:id_product", authenticateUser, upload.array('imagesProduct', 5) ,editProduct);

productRoute.delete("/:id_product", authenticateUser, deleteProduct);

module.exports = productRoute;
