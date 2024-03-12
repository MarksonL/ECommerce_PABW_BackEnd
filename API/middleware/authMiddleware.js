const { User } = require("../models/index.js");

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

module.exports = { isEmailExist };
