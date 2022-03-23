const Sequelize = require('sequelize')
const Op = Sequelize.Op
const express = require("express");
const router = express.Router();
const uuid = require('uuid');
const jwtAuth = require("../lib/jwtAuth");
const { User, JOB, JobApplicant, Recruiter, sequelize, Applications } = require('../db/models')


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
    rid: user.uid
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
router.get("/jobs", jwtAuth, async (req, res) => {
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
    // console.log(jobTypes);
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
        [Op.gte]: parseInt(req.query.salaryMin)
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
      req.query.asc.forEach(column => {
        sortParams.push([column, 'ASC'])
      })
    }
    else {
      sortParams.push([req.query.asc, 'ASC'])
    }
  }

  if (req.query.desc) {
    if (Array.isArray(req.query.desc)) {
      req.query.desc.forEach(column => {
        sortParams.push([column, 'DESC'])
      })
    }
    else { sortParams.push([req.query.desc, 'DESC']) }
  }


  let queryParams = {
    where: findParams,
    order: sortParams,
    include: [{ model: Recruiter, attributes: ['name'], required: true }]
  }


  // console.log("QueryParams are:",queryParams);

  await JOB.findAll(queryParams)
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
      console.log("ERROR JOINING:", err)
      res.status(400).json(err);
    });
});


// to get info about a particular job
router.get("/jobs/:id", jwtAuth, (req, res) => {
  JOB.findByPk(req.params.id)
    .then((job) => {
      if (job == null) {
        res.status(400).json({
          message: "Job does not exist",
        });
        return;
      }
      res.json(job);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// to update info of a particular job
router.put("/jobs/:id", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type != "recruiter") {
    res.status(401).json({
      message: "You don't have permissions to change the job details",
    });
    return;
  }
  JOB.findOne({
    where: {
      jid: req.params.id,
      rid: user.uid,
    }

  })
    .then((job) => {
      if (job == null) {
        res.status(404).json({
          message: "Job does not exist",
        });
        return;
      }
      const data = req.body;
      if (data.maxApplicants) {
        job.maxApplicants = data.maxApplicants;
      }
      if (data.maxPositions) {
        job.maxPositions = data.maxPositions;
      }
      if (data.deadline) {
        job.deadline = data.deadline;
      }
      job
        .save()
        .then(() => {
          res.json({
            message: "Job details updated successfully",
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// to delete a job
router.delete("/jobs/:id", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type != "recruiter") {
    res.status(401).json({
      message: "You don't have permissions to delete the job",
    });
    return;
  }
  JOB.Destroy({
    jid: req.params.id,
    rid: user.uid,
  })
    .then((job) => {
      if (job === null) {
        res.status(401).json({
          message: "You don't have permissions to delete the job",
        });
        return;
      }
      res.json({
        message: "Job deleted successfully",
      });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// get user's personal details
router.get("/user", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type === "recruiter") {
    Recruiter.findByPk(user.uid)
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
    JobApplicant.findByPk(user.uid)
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
        JobApplicant.findByPk(userData.uid)
          .then((jobApplicant) => {
            console.log("JOBAPPLICANT DETAILS:", jobApplicant)
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
      console.log("Error:", err)
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
        const updatingData = { name: data.name, contactNumber: data.contactNumber, bio: data.bio }
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
    JobApplicant.findByPk(user.uid)
      .then((jobApplicant) => {
        if (jobApplicant == null) {
          res.status(404).json({
            message: "User does not exist",
          });
          return;
        }
        const updatingData = { name: data.name, education: data.education, skills: data.skills, resume: data.resume, profile: data.profile }
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

router.post("/jobs/:id/applications", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type != "applicant") {
    res.status(401).json({
      message: "You don't have permissions to apply for a job",
    });
    return;
  }
  console.log("USER DETAILS:", user)
  const data = req.body;
  const jobId = req.params.id;

  // check whether applied previously
  // find job
  // check count of active applications < limit
  // check user had < 10 active applications && check if user is not having any accepted jobs (user id)
  // store the data in applications

  Applications.findOne({
    where: {
      aid: user.uid,
      jid: jobId,
      status: {
        [Op.notIn]: ["deleted", "accepted", "cancelled"]
      }
    }
  })
    .then((appliedApplication) => {
      console.log(appliedApplication);
      if (appliedApplication !== null) {
        res.status(400).json({
          message: "You have already applied for this job",
        });
        return;
      }

      JOB.findByPk(jobId)
        .then((job) => {
          if (job === null) {
            res.status(404).json({
              message: "Job does not exist",
            });
            return;
          }
          Applications.count({
            where: {
              jid: jobId,
              status: {
                [Op.notIn]: ["rejected", "deleted", "cancelled", "finished"]
              },
            }
          })
            .then((activeApplicationCount) => {
              if (activeApplicationCount < job.maxApplicants) {
                Applications.count({
                  where: {
                    aid: user.uid,
                    status: {
                      [Op.notIn]: ["rejected", "deleted", "cancelled", "finished"]
                    },
                  }
                })
                  .then((myActiveApplicationCount) => {
                    if (myActiveApplicationCount < 10) {
                      Applications.count({
                        where: {
                          aid: user.uid,
                          status: "accepted",
                        }
                      }).then((acceptedJobs) => {
                        if (acceptedJobs === 0) {
                          const applicationData = {
                            aid: user.uid,
                            rid: job.rid,
                            jid: job.jid,
                            status: "applied",
                            sop: data.sop,
                          };
                          Applications.create(applicationData).then(() => {
                            res.json({
                              message: "Job application successful",
                            });
                          })
                            .catch((err) => {
                              res.status(400).json(err);
                            });
                        } else {
                          res.status(400).json({
                            message:
                              "You already have an accepted job. Hence you cannot apply.",
                          });
                        }
                      });
                    } else {
                      res.status(400).json({
                        message:
                          "You have 10 active applications. Hence you cannot apply.",
                      });
                    }
                  })
                  .catch((err) => {
                    res.status(400).json(err);
                  });
              } else {
                res.status(400).json({
                  message: "Application limit reached",
                });
              }
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// recruiter gets applications for a particular job [pagination] [todo: test: done]
router.get("/jobs/:id/applications", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type != "recruiter") {
    res.status(401).json({
      message: "You don't have permissions to view job applications",
    });
    return;
  }
  const jobId = req.params.id;

  // const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  // const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  // const skip = page - 1 >= 0 ? (page - 1) * limit : 0;

  let findParams = {
    jid: jobId,
    rid: user.uid,
  };

  let sortParams = {};

  if (req.query.status) {
    findParams = {
      ...findParams,
      status: req.query.status,
    };
  }

  Applications.findAll({ where: findParams, order: sortParams })
    .then((applications) => {
      res.json(applications);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});


// recruiter/applicant gets all his applications [pagination]
router.get("/applications", jwtAuth, (req, res) => {
  const user = req.user;

  // const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  // const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  // const skip = page - 1 >= 0 ? (page - 1) * limit : 0;
  console.log("Req received")
  if (user.type == "recruiter") {
    Applications.findAll({ where: { rid: user.uid } ,include:[{model:JOB,order: ['dateOfPosting', 'ASC']},{model:Recruiter}]})
      .then((applications) => {
        res.json(applications);
      })
      .catch((err) => {
        console.log(err)
        res.status(400).json(err);
      });
  }
  else {
    Applications.findAll({ where: { aid: user.uid },include:[{model:JOB,order: ['dateOfPosting', 'ASC']},{model:Recruiter}]})
      .then((applications) => {
        res.json(applications);
      })
      .catch((err) => {
        console.log(err)
        res.status(400).json(err);
      });
  }
});


// update status of application: [Applicant: Can cancel, Recruiter: Can do everything] [todo: test: done]
router.put("/applications/:id", jwtAuth, (req, res) => {
  const user = req.user;
  const applicationId = req.params.id;
  console.log("APPLICATION ID is:", applicationId)
  const status = req.body.status;

  // "applied", // when a applicant is applied
  // "shortlisted", // when a applicant is shortlisted
  // "accepted", // when a applicant is accepted
  // "rejected", // when a applicant is rejected
  // "deleted", // when any job is deleted
  // "cancelled", // an application is cancelled by its author or when other application is accepted
  // "finished", // when job is over

  if (user.type === "recruiter") {
    if (status === "accepted") {
      // get job id from application
      // get job info for maxPositions count
      // count applications that are already accepted
      // compare and if condition is satisfied, then save

      Applications.findOne({
        where: {
          applicationId: applicationId,
          rid: user.uid,
        }
      })
        .then((application) => {
          if (application === null) {
            res.status(404).json({
              message: "Application not found",
            });
            return;
          }

          JOB.findOne({
            where: {
              jid: application.jid,
              rid: user.uid,
            }
          }).then((job) => {
            if (job === null) {
              res.status(404).json({
                message: "Job does not exist",
              });
              return;
            }

            Applications.count({
              where: {
                rid: user.uid,
                jid: job.jid,
                status: "accepted",
              }
            }).then((activeApplicationCount) => {
              if (activeApplicationCount < job.maxPositions) {
                // accepted
                application
                  .update({ status: status, dateOfJoining: req.body.dateOfJoining })
                  .then(() => {
                    Applications.update({
                      status: "cancelled",
                    }, {
                      where: {
                        applicationId: {
                          [Op.ne]: application.applicationId,
                        },
                        rid: application.rid,
                        status: {
                          [Op.notIn]: [
                            "rejected",
                            "deleted",
                            "cancelled",
                            "accepted",
                            "finished",
                          ],
                        },
                      }
                    }


                    )
                      .then(() => {
                        if (status === "accepted") {
                          JOB.update({
                            acceptedCandidates: activeApplicationCount + 1,
                          },
                            {
                              where: {
                                jid: job.jid,
                                rid: user.uid,
                              }
                            },

                          )
                            .then(() => {
                              res.json({
                                message: `Application ${status} successfully`,
                              });
                            })
                            .catch((err) => {
                              res.status(400).json(err);
                            });
                        } else {
                          res.json({
                            message: `Application ${status} successfully`,
                          });
                        }
                      })
                      .catch((err) => {
                        res.status(400).json(err);
                      });
                  })
                  .catch((err) => {
                    res.status(400).json(err);
                  });
              } else {
                res.status(400).json({
                  message: "All positions for this job are already filled",
                });
              }
            });
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } else {
      Applications.update({
        status: status,
      }, {
        where: {
          applicationId: applicationId,
          rid: user.uid,
          status: {
            [Op.notIn]: ["rejected", "deleted", "cancelled"],
          },
        },
      })
        .then((application) => {
          if (application === null) {
            res.status(400).json({
              message: "Application status cannot be updated",
            });
            return;
          }
          if (status === "finished") {
            res.json({
              message: `Job ${status} successfully`,
            });
          } else {
            res.json({
              message: `Application ${status} successfully`,
            });
          }
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    }
  } else {
    if (status === "cancelled") {

      Applications.update({
        status: status,
      }, {
        where: {
          applicationId: applicationId,
          aid: user.uid,
        }
      }
      )
        .then((tmp) => {
          console.log(tmp);
          res.json({
            message: `Application ${status} successfully`,
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } else {
      res.status(401).json({
        message: "You don't have permissions to update job status",
      });
    }
  }
});


// get a list of final applicants for current job : recruiter
// get a list of final applicants for all his jobs : recuiter
router.get("/applicants", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type === "recruiter") {
    let findParams = {
      rid: user.uid,
    };
    if (req.query.jobId) {
      findParams = {
        ...findParams,
        jid: req.query.jobId,
      };
    }
    if (req.query.status) {
      if (Array.isArray(req.query.status)) {
        findParams = {
          ...findParams,
          status: { [Op.in]: req.query.status },
        };
      } else {
        findParams = {
          ...findParams,
          status: req.query.status,
        };
      }
    }
    let sortParams = [];

    if (!req.query.asc && !req.query.desc) {
      sortParams.push(['aid', 'ASC']);
    }

    if (req.query.asc) {
      if (Array.isArray(req.query.asc)) {
        req.query.asc.forEach((column) => {
          sortParams.push([column, 'ASC'])
        })
      } else {
        sortParams.push([req.query.asc, 'ASC'])
      }
    }

    if (req.query.desc) {
      if (Array.isArray(req.query.desc)) {
        req.query.desc.forEach((column) => {
          sortParams.push([column, 'DESC'])
        })
      } else {
        sortParams.push([req.query.desc, 'DESC'])
      }
    }

    Applications.findAll({ where: { rid: user.uid }, order: sortParams, include: [{ model: JOB }, { model: JobApplicant }] })
      .then((applications) => {
        if (applications.length === 0) {
          res.status(404).json({
            message: "No applicants found",
          });
          return;
        }
        res.json(applications);
      })
      .catch((err) => {
        console.log("ERRROR OCCURED:", err)
        res.status(400).json(err);
      });
  } else {
    res.status(400).json({
      message: "You are not allowed to access applicants list",
    });
  }
});

module.exports = router;