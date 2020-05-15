const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (user == null) {
    return res.status(401).json({ error: "invalid username" });
  }

  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
  if (passwordCorrect) {
    const userForToken = {
      username: user.username,
      id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET);
    res.status(200).json({ token, username, name: user.name });
  } else {
    res.status(401).json({ error: "invalid password" });
  }
});

module.exports = router;
