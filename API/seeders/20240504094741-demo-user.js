'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [
      {
        fullname: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        alamat: '123 Main Street',
        nomorTelepon: '1234567890',
        role: 'PENGGUNA',
        saldoElektronik: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Tambahkan data lainnya jika diperlukan
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Menemukan baris yang telah dimasukkan oleh seeder ini dan menghapusnya
    return queryInterface.bulkDelete('users', {
      email: 'john@example.com' // Sesuaikan dengan kriteria yang unik
    });
  }
};
