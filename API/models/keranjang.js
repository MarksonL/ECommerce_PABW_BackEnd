const {db} = require("../config/db");
const {DataTypes} = require("sequelize");

const Cart = db.define ("cart",{
    id_keranjang : {
        primaryKey : true,
        type : DataTypes.INTEGER,
        autoIncrement : true
    },
    jumlahBarang : {
        type : DataTypes.INTEGER,
        allowNull : false
    }
})

module.exports = {
    Cart
}