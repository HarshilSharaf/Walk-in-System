const Sequelize = require("sequelize");
const sequelize = new Sequelize("jobportal", "postgres", "Krunal@8571865", {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
  logging: false,
});
module.exports = sequelize;
