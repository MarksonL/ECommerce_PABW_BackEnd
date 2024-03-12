const {db} = require("../config/db");
const {DataTypes} = require("sequelize");

const Product = db.define('product', {
    id_product : {
        primaryKey : true,
        type : DataTypes.INTEGER,
        autoIncrement : true
    },
    namaProduk : {
        type : DataTypes.STRING,
        allowNull : false
    },
    hargaProduk : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    stokProduk : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    statusProduk : {
        type : DataTypes.ENUM(['stok kosong',
        'stok tersedia'])
    }
})

module.exports = {
    Product
}