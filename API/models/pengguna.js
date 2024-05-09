// import db from "../db.js";
const { db } = require("../config/db");
const { DataTypes } = require("sequelize");

const User = db.define("users", {
  id_user: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  alamat: {
    type: DataTypes.STRING,
    // allowNull : false
  },
  nomorTelepon: {
    type: DataTypes.STRING,
    // allowNull : false
  },
  role: {
    type: DataTypes.ENUM("ADMIN", "PENGGUNA", "KURIR"),
    allowNull: false,
  },
  saldoElektronik: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = {
  User,
};
