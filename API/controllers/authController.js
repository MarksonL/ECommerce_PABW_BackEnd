const { User, Cart } = require("../models/index.js");
const { logs } = require("../models/index.js");
const jwt = require("jsonwebtoken");
const { registrationSchema } = require("../utils/joiValidation.js")
// const bcrypt = require('bcrypt');
const dotenv = require("dotenv");
dotenv.config();

const createUser = async (
  fullname,
  email,
  password,
  alamat = null,
  nomorTelepon = null,
  role,
  saldoElektronik = 0
) => {
  const formattedUppercaseRole = role.toUpperCase();

  return await User.create({
    fullname,
    email,
    password,
    alamat,
    nomorTelepon,
    role: formattedUppercaseRole,
    saldoElektronik,
  });
};

const createCart = async (userId) => {
  return await Cart.create({
    id_user: userId,
    total_price: 0,
  });
};

const register = async (req, res) => {
  try {
    const { error, value } = registrationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { fullname, email, password } = value;

    const newUser = await createUser(fullname, email, password, null, null, "PENGGUNA", 0);

    if (newUser) {
      await createCart(newUser.id_user);

      await logs.create({
        pesan: `New user with ID ${newUser.id_user} registers`,
        waktu: Date.now(),
      });

      return res.status(200).json({
        message: "User Created",
        data: newUser,
      });
    } else {
      throw new Error("Failed to create user");
    }
  } catch (error) {
    return res.status(400).json({
      message: error.message,
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

    await logs.create({
      pesan: `User with ID ${user.id_user} logs in`,
      waktu: Date.now(),
    });

    console.log(typeof user.password);
    console.log(typeof password);

    if (user) {
      // User found, now check password
      if (password == user.password) {
        // Perbandingan string sederhana
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
          msg: "Login Success",
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
      msg: "Authorized",
      payload: {
        userId,
        fullname,
        role,
      },
    });
  });
};

module.exports = {
  register,
  login,
  decodedToken,
  createUser,
  createCart,
};
