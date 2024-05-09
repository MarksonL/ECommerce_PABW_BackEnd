const {db} = require("../config/db");
const {DataTypes} = require("sequelize");

const detailCart = db.define ("detail_cart",{
    id_detail_keranjang : {
        primaryKey : true,
        type : DataTypes.INTEGER,
        autoIncrement : true
    },
    jumlah_barang : {
        type : DataTypes.INTEGER
    }
})

module.exports = {
    detailCart
}