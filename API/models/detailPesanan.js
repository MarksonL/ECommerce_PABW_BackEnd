const {db} = require("../config/db");
const {DataTypes} = require("sequelize");

const OrderDetail = db.define('orderDetail',{
    id_detailPesanan : {
        primaryKey : true,
        type : DataTypes.INTEGER,
        autoIncrement : true
    },
    orderDate : {
        type : DataTypes.DATE,
        allowNull : false
    },
    jumlahBarang : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    

})