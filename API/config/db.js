const {Sequelize} = require("sequelize");

const db = new Sequelize({
  dialect: "mysql",
  host: "localhost",
  username: "root",
  password: "",
  database: "ecommercepabw",
});

module.exports = {
  db,
};
