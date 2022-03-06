const Sequelize = require("sequelize");
const sequelize = new Sequelize("jobportal", "postgres", "harshil", {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
  logging: false,
});
module.exports = sequelize;
