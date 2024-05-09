const { logs } = require('../models/logs');

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

module.exports = {
    getAllLogs
};
