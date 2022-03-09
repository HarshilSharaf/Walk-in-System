const Sequelize = require('sequelize')
const Op  = Sequelize.Op
const express = require("express");
const router = express.Router();
const uuid = require('uuid');
const JOB = require('../db/Job')
const jwtAuth = require("../lib/jwtAuth");
const Recruiter =require('../db/Recruiter')
const JobApplicant = require('../db/JobApplicant')
const User = require("../db/User")


router.post("/jobs", jwtAuth, (req, res) => {
  const user = req.user;

  if (user.type != "recruiter") {
    res.status(401).json({
      message: "You don't have permissions to add jobs",
    });
    return;
  }

  const data = req.body;

  const jobData = {
    jid: uuid.v4(),
    title: data.title,
    maxApplicants: data.maxApplicants,
    maxPositions: data.maxPositions,
    deadline: data.deadline,
    skillsets: data.skillsets,
    jobType: data.jobType,
    duration: data.duration,
    salary: parseInt(data.salary),
    rating: data.rating,
    rid:user.uid
  };

  JOB.create(jobData)
    .then(() => {
      res.json({ message: "Job added successfully to the database" });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// to get all the jobs [pagination] [for recruiter personal and for everyone]
router.get("/jobs", jwtAuth, (req, res) => {
  let user = req.user;

  let findParams = {};
  let sortParams = [];

  // const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  // const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  // const skip = page - 1 >= 0 ? (page - 1) * limit : 0;

  // to list down jobs posted by a particular recruiter
  if (user.type === "recruiter" && req.query.myjobs) {
    findParams = {
      ...findParams,
      rid: user.uid,
    };
  }

  if (req.query.q) {
    findParams = {
      ...findParams,
      title: {
        [Op.substring]: req.query.q
      },
    };
  }

  if (req.query.jobType) {
    let jobTypes = [];
    if (Array.isArray(req.query.jobType)) {
      jobTypes = req.query.jobType;
    } else {
      jobTypes = [req.query.jobType];
    }
    console.log(jobTypes);
    findParams = {
      ...findParams,
      jobType: {
        [Op.in]: jobTypes,
      },
    };
  }

  if (req.query.salaryMin && req.query.salaryMax) {
    findParams = {
      ...findParams,
      salary: {
        [Op.and]: {
          [Op.gte]: parseInt(req.query.salaryMin),
          [Op.lte]: parseInt(req.query.salaryMax)
        }
      }

    };
  } else if (req.query.salaryMin) {
    findParams = {
      ...findParams,
      salary: {
        [Op.gte]:parseInt(req.query.salaryMin)
      },
    };
  } else if (req.query.salaryMax) {
    findParams = {
      ...findParams,
      salary: {
       [Op.lte]: parseInt(req.query.salaryMax),
      },
    };
  }

  if (req.query.duration) {
    findParams = {
      ...findParams,
      duration: {
        [Op.lt]: parseInt(req.query.duration),
      },
    };
  }

  if (req.query.asc) {
    if (Array.isArray(req.query.asc)) {
    req.query.asc.forEach(column=>{
      sortParams.push([column,'ASC'])
    })
  }
  else {
    sortParams.push([req.query.asc,'ASC'])
  }
  }

  if (req.query.desc) {
    if (Array.isArray(req.query.desc)) {
    req.query.desc.forEach(column=>{
      sortParams.push([column,'DESC'])
    })
  }
  else {sortParams.push([req.query.desc,'DESC'])}
  }

  console.log("FindParams are:",findParams);
  console.log("SortParams are:",sortParams);

 
  let queryParams = {
    where: findParams,
    order: sortParams

  }


  console.log("QueryParams are:",queryParams);

  JOB.findAll(queryParams)
    .then((posts) => {
      if (posts == null) {
        res.status(404).json({
          message: "No job found",
        });
        return;
      }
      res.json(posts);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});


// get user's personal details
router.get("/user", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type === "recruiter") {
    Recruiter.findByPk(user.uid )
      .then((recruiter) => {
        if (recruiter == null) {
          res.status(404).json({
            message: "User does not exist",
          });
          return;
        }
        res.json(recruiter);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    JobApplicant.findByPk(user.uid )
      .then((jobApplicant) => {
        if (jobApplicant == null) {
          res.status(404).json({
            message: "User does not exist",
          });
          return;
        }
        res.json(jobApplicant);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});

// get user details from id
router.get("/user/:id", jwtAuth, (req, res) => {
  User.findByPk(req.params.id)
    .then((userData) => {
      if (userData === null) {
        res.status(404).json({
          message: "User does not exist",
        });
        return;
      }

      if (userData.type === "recruiter") {
        Recruiter.findByPk(userData.uid)
          .then((recruiter) => {
            if (recruiter === null) {
              res.status(404).json({
                message: "User does not exist",
              });
              return;
            }
            res.json(recruiter);
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      } else {
        JobApplicant.findByPk(userData.uid )
          .then((jobApplicant) => {
            if (jobApplicant === null) {
              res.status(404).json({
                message: "User does not exist",
              });
              return;
            }
            res.json(jobApplicant);
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// update user details
router.put("/user", jwtAuth, (req, res) => {
  const user = req.user;
  const data = req.body;
  if (user.type == "recruiter") {
    Recruiter.findByPk(user.uid)
      .then((recruiter) => {
        if (recruiter == null) {
          res.status(404).json({
            message: "User does not exist",
          });
          return;
        }
        const updatingData={name:data.name,contactNumber:data.contactNumber,bio:data.bio}
        recruiter.update(updatingData).then(() => {
          res.json({
            message: "User information updated successfully",
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
        
        
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    JobApplicant.findByPk( user.uid )
      .then((jobApplicant) => {
        if (jobApplicant == null) {
          res.status(404).json({
            message: "User does not exist",
          });
          return;
        }
        const updatingData={name:data.name,education:data.education,skills:data.skills,resume:data.resume,profile:data.profile}
     
        console.log(jobApplicant);
        jobApplicant
          .update(updatingData)
          .then(() => {
            res.json({
              message: "User information updated successfully",
            });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});

module.exports = router;