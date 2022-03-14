const User = require('./User')
const JOB = require('./Job')
const JobApplicant = require('./JobApplicant')
const Recruiter = require('./Recruiter')
const sequelize = require('../db/Connection')
const Sequelize = require("sequelize");

JOB.belongsTo(Recruiter,{foreignKey:{name:'rid',type:Sequelize.UUID,
allowNull:false,} } )
Recruiter.hasMany(JOB)


sequelize.sync({force:true}).then(() => console.log("All Tables Created Successfully"))

module.exports = { User, JOB, JobApplicant, Recruiter, sequelize }