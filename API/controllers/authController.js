const { User } = require("../models/index.js");
const jwt = require("jsonwebtoken");
// const bcrypt = require('bcrypt');
const dotenv = require("dotenv");
dotenv.config();

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
    
    console.log(typeof user.password);
    console.log(typeof password);

    if (user) {
      // User found, now check password
      if (password == user.password) { // Perbandingan string sederhana
        const accessToken = jwt.sign(
          {
            userId: user.id_user,
            fullname: user.fullname,
            role: user.role,
          },
          process.env.ACCESS_SECRET_KEY,
          { expiresIn: "3h" }
        );
        return res.status(200).json({
          msg: "Berhasil login!",
          token: accessToken,
        });
      } else {
        // Password is incorrect
        return res.status(401).json({
          msg: "Password salah",
        });
      }
    } else {
      // User not found
      return res.status(404).json({
        msg: "User not found",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      msg: "Terjadi kesalahan server",
    });
  }
};

const decodedToken = (req, res) => {
  const { token } = req.body;

  jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, decoded) => {
    if (err) return res.status(err).json({ payload: err });
    const userId = decoded.userId;
    const fullname = decoded.fullname;
    const role = decoded.role;
    return res.status(200).json({
      msg: 'Authorized',
      payload: {
        userId,
        fullname,
        role,
      }
    })
      
  });
};

module.exports = {
  register,
  login,
  decodedToken,
};
