const express = require("express");
const router = express.Router();
const uuid = require('uuid');
const JOB= require('../db/Job')
const jwtAuth = require("../lib/jwtAuth");



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
    };
  
    JOB.create(jobData)
        .then(() => {
            res.json({ message: "Job added successfully to the database" });
        })
        .catch((err) => {
            res.status(400).json(err);
        });
});

module.exports = router;