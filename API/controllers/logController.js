const { logs } = require('../models/logs');
const { Op } = require('sequelize');

const getAllLogs = async (req, res) => {
    try {
        // Mengambil semua data logs dari tabel
        const allLogs = await logs.findAll();

        // Mengembalikan data logs yang berhasil diambil
        res.status(200).json(allLogs);
    } catch (error) {
        // Menangani kesalahan jika terjadi
        console.error('Error retrieving logs:', error);
        res.status(500).json({ error: 'Error retrieving logs' });
    }
};


const getTransactionHistory = async (req, res) => {
  const userId = req.user.id_user;
  try {
    const transactionHistory = await logs.findAll({
      where: {
        type_log: {
          [Op.in]: ['Transaction', 'Top Up'],
        },
        pesan: {
          [Op.like]: `%User with ID ${userId}%`,
        },
      },
      order: [['waktu', 'DESC']],
    });
    res.json({data: transactionHistory});
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
    getAllLogs,
    getTransactionHistory,
};
