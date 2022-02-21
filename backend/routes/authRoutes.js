const uuid= require('uuid');
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const authKeys = require("../lib/authKeys");

const User = require("../db/User");

const router = express.Router();

router.post("/signup", (req, res) => {
  const data = req.body;
  let user_data = {
    uid: uuid.v4(),
    email: data.email,
    password: data.password,
    type: data.type,
  };
  User.create(user_data).then(() => {

    const token = jwt.sign({ _id: user_data.uid }, authKeys.jwtSecretKey);
    res.json({
      token: token,
      type: user_data.type,

    });
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
