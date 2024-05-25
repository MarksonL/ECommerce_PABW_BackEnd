const { User, Cart } = require("../models/index.js");
const { logs } = require("../models/index.js");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const { registrationSchema } = require("../utils/joiValidation.js")
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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
    verificationToken: jwt.sign({ email }, process.env.ACCESS_SECRET_KEY, { expiresIn: '1h' })
  });
};

const createCart = async (userId) => {
  return await Cart.create({
    id_user: userId,
    total_price: 0,
  });
};

const sendVerificationEmail = async (req, res) => {
  try {
    const { email, verificationToken } = req.body;

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Email Verification',
      html: `
        <h2>Verify Your Email Address</h2>
        <p>Hi,</p>
        <p>Thank you for registering. Please click the link below to verify your email address:</p>
        <a href="${process.env.FE_URL}/auth/verify-email?token=${verificationToken}">Link Verify Email</a>
        <p>If you did not register for this account, please ignore this email.</p>
        <br>
        <p>Thanks,</p>
        <p>E-Commerce PABW</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Verification email sent successfully!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
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
        type_log: "Register",
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

const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
    const user = await User.findOne({ where: { email: decoded.email } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid token.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified.' });
    }

    user.isVerified = 1;
    user.verificationToken = null;
    await user.save();

    return res.status(200).json({ message: 'Email verified successfully!' });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or expired token.' + error.message });
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

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    await logs.create({
      type_log: "Login",
      pesan: `User with ID ${user.id_user} logs in`,
      waktu: Date.now(),
    });

    if (password === user.password) {
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
      return res.status(401).json({
        msg: "Password salah",
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
    if (err) return res.status(500).json({ payload: err });
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

const getMe = async (req, res) => {
  const user = req.user;
  try {
    const userData = await User.findByPk(user.id_user);

    return res.status(200).json({
      message: "User has been retrieved",
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  decodedToken,
  createUser,
  createCart,
  sendVerificationEmail, // Tambahkan fungsi pengiriman email verifikasi di sini
  getMe,
};
