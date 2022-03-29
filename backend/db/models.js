const User = require('./User')
const JOB = require('./Job')
const JobApplicant = require('./JobApplicant')
const Applications = require('./Applications')
const Recruiter = require('./Recruiter')
const sequelize = require('../db/Connection')
const Sequelize = require("sequelize");
const {Rating} = require('./Rating')
const { DataTypes } = require("sequelize");

JOB.belongsTo(Recruiter, {
    foreignKey: {
        name: 'rid', 
        type: Sequelize.UUID,
        allowNull: false,
    }
})
// Recruiter.hasMany(JOB)
Applications.belongsTo(JOB,{
    foreignKey: {
        name: 'jid', 
        type: Sequelize.UUID,
        allowNull: false,
    }
})
// Applications.belongsTo(JOB,{
//     foreignKey:{
//         name: 'dateOfPosting',
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW
        
//     },
//     targetKey:'dateOfPosting'
// })
Applications.belongsTo(JobApplicant,{
    foreignKey: {
        name: 'aid', 
        type: Sequelize.UUID,
        allowNull: false,
    },
    targetKey:'aid'
})
// JOB.hasMany(Applications)

Applications.belongsTo(Recruiter,{
    foreignKey:'rid',
    type: Sequelize.UUID,
    allowNull: false,
})


sequelize.sync({ alter:true,force: false }).then(() => console.log("All Tables Created Successfully"))

module.exports = { User, JOB, JobApplicant, Recruiter, sequelize ,Applications,Rating}