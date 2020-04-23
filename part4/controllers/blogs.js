const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");

router
  .route("/")
  .get((req, res) => {
    Blog.find({}).then((blogs) => {
      res.json(blogs);
    });
  })
  .post((req, res) => {
    const blog = new Blog(req.body);

    blog.save().then((result) => {
      res.status(201).json(result);
    });
  });

module.exports = router;
