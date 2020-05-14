const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

router
  .route("/")
  .get(async (req, res) => {
    const users = await User.find({});

    res.json(users);
  })
  .post(async (req, res) => {
    const { username, password, name } = req.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ username, name, passwordHash });
    const result = await newUser.save();

    res.json(result.toJSON());
  });

module.exports = router;
