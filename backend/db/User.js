const bcrypt = require("bcrypt");
const Sequelize = require("sequelize")

const sequelize = new Sequelize("jobportal", "postgres", "harshil", {
  host: "localhost",
  port: 5432,
  dialect: 'postgres',
  logging: false,


})

const User = sequelize.define('users',
  {

    uid: {
      type: Sequelize.UUID,
      defaultValue:Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    type: {
      type: Sequelize.ENUM("recruiter", "applicant"),
      allowNull: false
    },
    created_on: {
      type: Sequelize.TIME,
      defaultValue: Sequelize.NOW,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSaltSync(10, 'a');
          user.password = bcrypt.hashSync(user.password, salt);
         }
      
      }},
  timestamps: false
}
)

module.exports= User 