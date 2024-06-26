const {db} = require("../config/db");
const {DataTypes} = require("sequelize");

const Cart = db.define ("cart",{
    id_keranjang : {
        primaryKey : true,
        type : DataTypes.INTEGER,
        autoIncrement : true
    },
    total_price : {
        type : DataTypes.INTEGER
    }
})

module.exports = {
    Cart
}