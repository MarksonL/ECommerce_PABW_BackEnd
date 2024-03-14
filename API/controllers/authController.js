const { User } = require("../models/index.js");

const register = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    const newUser = await User.create({
      fullname,
      email,
      password,
      role: "PENGGUNA",
      saldoElektronik: 0,
    });

    return res.status(200).json({
      message: "User Created",
      data: newUser,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message, // Menggunakan pesan kesalahan yang lebih informatif
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    console.log(user);
    return res.status(200).json({
      msg: "Login Success",
      user,
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  register,
  login,
};
