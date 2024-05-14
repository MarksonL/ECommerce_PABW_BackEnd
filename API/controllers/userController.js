const { User } = require('../models/index.js');

const editUserProfile = async (req, res) => {
  const userId = req.user.id_user;
  const { fullname, alamat, nomorTelepon } = req.body;

  try {
    // Temukan pengguna berdasarkan ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update data profil pengguna
    user.fullname = fullname || user.fullname;
    user.email = user.email;
    user.password = user.password;
    user.alamat = alamat || user.alamat;
    user.nomorTelepon = nomorTelepon || user.nomorTelepon;

    // Simpan perubahan pada profil pengguna dan simpan ke dalam updatedUser
    const updatedUser = await user.save();

    return res.status(200).json({ message: "User profile updated successfully", updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  editUserProfile,
};
