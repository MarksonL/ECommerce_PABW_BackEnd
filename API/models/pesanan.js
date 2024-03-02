const {db} = require("../config/db");
const {DataTypes} = require("sequelize");

const Order = db.define('orders',{
    id_order : {
        primaryKey : true,
        type : DataTypes.INTEGER,
        autoIncrement : true
    },
    orderDate : {
        type : DataTypes.DATE,
        allowNull : false 
    },
    totalPrice : {
        type : DataTypes.INTEGER,
        allowNull : false
    }
})

module.exports = {
    Order
}