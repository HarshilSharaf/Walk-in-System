const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");
const sequelize = require("./Connection");

const Rating = sequelize.define('ratings',{
    ratingId:{
        type: Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    category:{
        type:Sequelize.STRING,
        allowNull: false,
        isIn:[["job", "applicant"]]
    },
    receiverId:{
        type:Sequelize.UUID,
        allowNull:false
    },
    senderId:{
        type:Sequelize.UUID,
        allowNull:false
    },
    rating:{
        type:Sequelize.INTEGER,
        defaultValue: -1,
        min: -1,
        max: 5.0
    }
})

module.exports = {Rating}