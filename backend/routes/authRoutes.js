const uuid = require('uuid');
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const authKeys = require("../lib/authKeys");

const User = require("../db/User");
const Recruiter = require("../db/Recruiter");
const JobApplicant = require("../db/JobApplicant");

const router = express.Router();

router.post("/signup", (req, res) => {
  const data = req.body;
  const user_data = {
    uid: uuid.v4(),
    email: data.email,
    password: data.password,
    type: data.type,

  }
  User.create(user_data).then( () => {
    if (data.type == "recruiter") {
      Recruiter.create({
        rid: user_data.uid,
        name: data.name,
        contactNumber: data.contactNumber,
        bio: data.bio,
      }) .then(() => {
        // Token
        const token = jwt.sign({ _id: user_data.uid }, authKeys.jwtSecretKey);
        res.json({
          token: token,
          type: user_data.type,
        });
      })
      .catch((err) => {
        User
        .destroy({where :{uid:user_data.uid}})
        .then(() => {
          res.status(400).json(err);
        })
        .catch((err) => {
          res.json({ error: err });
        });
        err;
      });
    }
    else {
     JobApplicant.create({
        aid: user_data.uid,
        name: data.name,
        education: data.education,
        skills: data.skills,
        rating: data.rating,
        resume: data.resume,
        profile: data.profile,
      }) .then(() => {
        // Token
        const token = jwt.sign({ _id: user_data.uid }, authKeys.jwtSecretKey);
        res.json({
          token: token,
          type: user_data.type,
        });
      })
      .catch((err) => {
        User
          .destroy({where :{uid:user_data.uid}})
          .then(() => {
            res.status(400).json(err);
          })
          .catch((err) => {
            res.json({ error: err });
          });
        err;
      });;
    }


  }).finally(() => {
    console.log('Done')
  });


});

router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(401).json(info);
        return;
      }
      // Token
      const token = jwt.sign({ _id: user.uid }, authKeys.jwtSecretKey);
      res.json({
        token: token,
        type: user.type,
      });
    }
  )(req, res, next);
});

module.exports = router;
