const {db} = require("../config/db");
const {DataTypes} = require("sequelize");

const logs = db.define('logs', {
    id_log : {
        primaryKey : true,
        type : DataTypes.INTEGER,
        autoIncrement : true
    },
    pesan : {
        type : DataTypes.STRING,
        allowNull : false
    },
    waktu : {
        type : DataTypes.DATE,
        allowNull : false
    }
})

module.exports = {
    logs
}