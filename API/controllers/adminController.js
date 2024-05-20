const { User } = require("../models/index.js");
const { createUser, createCart } = require("./authController.js");
const { userSchema } = require("../utils/joiValidation.js");
const { logs } = require("../models/index.js");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    return res.status(200).json({
      message: "Successfully retrieved all users",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving all users",
    });
  }
};

const getUserById = async (req, res) => {
  const { id_user } = req.params;

  try {
    const dataUser = await User.findByPk(id_user);

    if (!dataUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Successfully retrieved user with id " + id_user,
      data: dataUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error: " + error.message,
    });
  }
};

const addUser = async (req, res) => {
  try {
    const { error, value } = userSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { fullname, email, password, alamat, nomorTelepon, role } = value;

    const user = await createUser(
      fullname,
      email,
      password,
      alamat,
      nomorTelepon,
      role
    );

    if (user) {
      if (user.role === "PENGGUNA") {
        await createCart(user.id_user);
      }
      return res.status(200).json({
        message: `${user.role} created successfully`,
        data: user,
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
  };

const editUser = async (req, res) => {
  const { id_user } = req.params;
  const isUserExist = await User.findByPk(id_user);

  try {
    if (!isUserExist) {
      return res.status(404).json({ message: "User not found." });
    }

    const { fullname, email, password, alamat, nomorTelepon, role } = req.body;

    // Menggunakan isUserExist jika nilai dari body adalah null atau undefined
    const updatedData = {
      fullname: fullname || isUserExist.fullname,
      email: email || isUserExist.email,
      password: password || isUserExist.password,
      alamat: alamat || isUserExist.alamat,
      nomorTelepon: nomorTelepon || isUserExist.nomorTelepon,
      role: role || isUserExist.role,
    };

    // Validasi data yang diperbarui menggunakan userSchema
    const { error } = userSchema.validate(updatedData);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Update data pengguna
    const updatedUser = await User.update(updatedData, {
      where: { id_user },
      returning: true,
    });

    if (role === "PENGGUNA") {
      await createCart(isUserExist.id_user);
    }

    return res.status(200).json({
      message: "User Update Success",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const deleteUser = async (req, res) => {
  const { id_user } = req.params;
  const isUserExist = await User.findByPk(id_user);

  try {
    if (!isUserExist) {
      return res.status(404).json({ message: "User not found." });
    }

    await User.destroy({
      where: { id_user: id_user },
    });

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const addSaldoElektronik = async (req, res) => {
  const { id_user } = req.params;
  const { saldoElektronik } = req.body;

  try {

    // Temukan pengguna berdasarkan ID
    const user = await User.findByPk(id_user);

    // Pastikan pengguna ditemukan
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Pastikan saldoToAdd adalah angka positif
    if (isNaN(saldoElektronik) || (user.saldoElektronik + parseInt(saldoElektronik)) < 0) {
      return res.status(400).json({ message: "Invalid saldo value." });
    }

    // Tambahkan saldo elektronik
    user.saldoElektronik += parseInt(saldoElektronik);

    // Simpan perubahan
    await user.save();

    await logs.create({
      type_log: "Top Up",
      pesan: `User with ID ${id_user} Top Up ${saldoElektronik}`,
      waktu: Date.now(),
    });

    return res.status(200).json({
      message: "Saldo elektronik added successfully.",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  addUser,
  getAllUsers,
  getUserById,
  editUser,
  deleteUser,
  addSaldoElektronik,
};
