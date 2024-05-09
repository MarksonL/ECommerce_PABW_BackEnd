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
    },
    id_kurir: {
        type: DataTypes.INTEGER,
        allowNull: true, // Jika setiap pesanan tidak selalu memiliki kurir
        references: {
            model: 'users',
            key: 'id_user'
        }
    }
});

module.exports = {
    Order
}