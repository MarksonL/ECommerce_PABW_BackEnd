const { User } = require("../models/index.js");
const { logs } = require("../models/index.js")

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
    if (newUser) {
      const newUserLog = await logs.create({
        pesan: `New user with ID ${newUser.id_user} registers`,
        waktu: Date.now(),
      });
    } else {
      message : error.message
    };
    return res.status(200).json({
      message: `User Created`,
      data: newUser,
    });
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
    const userLog = await logs.create({
      pesan : `User with ID ${user.id_user} logs in`,
      waktu : Date.now()
    })
    return res.status(200).json({
      msg: "Berhasil login!",
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
