const Sequelize = require("sequelize")

const db = new Sequelize("ecommercepabw", "root", "",{
  host: "localhost",
  dialect: "mysql",
});

module.exports = {
    db
}