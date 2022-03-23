const Sequelize = require("sequelize");
const sequelize = require("./Connection");
const { DataTypes } = require("sequelize");
const Job = sequelize.define("jobs",
    {
        jid: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        maxApplicants: {
            type: Sequelize.INTEGER,
            validate: {
                isInt: {
                    msg: "maxApplicants should be an integer",
                },
                min: {
                    args: 1,
                    msg: "maxApplicants should greater than 0",
                },
            },
        },
        maxPositions: {
            type: Sequelize.INTEGER,
            validate: {
                isInt: {
                    msg: "maxPositions should be an integer",
                },
                min: {
                    args: 1,
                    msg: "maxPositions should greater than 0",
                },
            },
        },
        activeApplications: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            validate: {
                isInt: {
                    msg: "activeApplications should be an integer",
                },
                // min: {
                //     args: 0,
                //     msg: "activeApplications should greater than 0",
                // },
            },
        },
        acceptedCandidates: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            validate: {
                isInt: {
                    msg: "acceptedCandidates should be an integer",
                },
                // min: {
                //     args: 0,
                //     msg: "acceptedCandidates should greater than 0",
                // },
            },
        },
        dateOfPosting: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        deadline: {
            type: DataTypes.DATE,
            // validate: 
            //     {
            //         validator: function (value) {
            //             const dop = new Date(this.dateOfPosting)
            //             if (dop < value)
            //                 throw new Error("deadline should be greater than dateOfPosting")
            //         },
                    
            //     },
            
        },
        skillsets: Sequelize.ARRAY(Sequelize.STRING),
        jobType: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        duration: {
            type: Sequelize.INTEGER,
            
            validate:{
                isInt: {
                    msg: "duration should be an integer",
                },
            min: 0, 
                
            },
        },
        salary: {
            type: Sequelize.INTEGER,
            validate: {
                isInt: {
                    msg: "salary should be an integer",
                },
            //    min:{
            //        args:0,
            //        msg:"salary should be greater than 0"
            //    }
            }
            
        },
        rating: {
            type: Sequelize.FLOAT,
            max: 5.0,
            defaultValue: -1.0,
            validate: {
               min:{
                   args:-1,
                   msg:"Invalid Rating"
               },
               max:{
                   args:5,
                   msg:"Invalid Rating"
               }
            },
        },
        // rid:{
        //     type:Sequelize.UUID,
        //     allowNull:false,
        //     references:{
        //         model:'recruiter',
        //         key:'rid'
        //     }
        // }
    }
,{
    timestamps: false,
  }
)


// Job.sync().then(() => console.log("Table Jobs Created"))
module.exports = Job