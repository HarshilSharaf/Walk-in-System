const Sequelize = require("sequelize")

const sequelize = new Sequelize("jobportal", "postgres", "harshil", {
  host: "localhost",
  port: 5432,
  dialect: 'postgres',
  logging: false,


})


const Recruiter = sequelize.define('recruiter',
  {

    rid: {
      type: Sequelize.UUID,
      defaultValue:Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      
    },
    contactNumber: {
      type: Sequelize.TEXT,
      allowNull: false,
      unique:true,
      validate: {
        validator: function(v) {
            if(v!==""){
                const regex = /\+\d{1,3}\d{10}/.test(v)
                if(!regex){
                    throw new Error('Phone number is invalid')
                }
                else return true
            
            }

         
        },
       
    }},
    
    bio: {
      type: Sequelize.TEXT,
    }
  }, {
   
  timestamps: false
}
)
Recruiter.sync().then(()=>console.log('Table Recruiter Created'))

module.exports =Recruiter