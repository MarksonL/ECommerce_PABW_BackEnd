const { User } = require("../models/index.js");
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
dotenv.config()

const isEmailExist = async (req, res, next) => {
  const { email } = req.body;

  try {
    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email is already registered. Please use a different email.",
      });
    }

    // Lanjutkan ke langkah berikutnya jika email belum terdaftar
    next();
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Ambil token dari header
    const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_KEY)
    const userId = decodedToken.userId; // Ambil id pengguna dari token
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = user; // Simpan informasi pengguna di objek permintaan untuk penggunaan selanjutnya
    next(); // Lanjutkan ke middleware atau fungsi berikutnya
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = req.user; // Ambil informasi pengguna dari objek permintaan

    // Periksa apakah pengguna memiliki peran sebagai admin
    if (user.role === 'ADMIN') {
      // Jika pengguna adalah admin, lanjutkan ke langkah berikutnya
      next();
    } else {
      // Jika pengguna bukan admin, kirim respons dengan status 403 Forbidden
      return res.status(403).json({
        message: "You are not authorized to access this resource.",
      });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = { isEmailExist, authenticateUser, isAdmin };
