const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");

router
  .route("/")
  .get(async (req, res) => {
    const blogs = await Blog.find({});

    res.json(blogs);
  })
  .post(async (req, res) => {
    const blog = new Blog(req.body);
    const result = await blog.save();

    res.status(201).json(result);
  });

router
  .route("/:id")
  .get(async (req, res) => {
    const id = req.params.id;

    const result = await Blog.findById(id);
    if (result) {
      res.json(result);
    } else {
      res.status(404).end();
    }
  })
  .delete(async (req, res) => {
    await Blog.findByIdAndRemove(req.params.id);
    res.status(204).end();
  })
  .put(async (req, res) => {
    const { title, url, likes, author } = req.body;

    const blogPost = {
      title,
      url,
      likes,
      author,
    };

    const updatedBlogPost = JSON.parse(JSON.stringify(blogPost));

    const result = await Blog.findByIdAndUpdate(
      req.params.id,
      updatedBlogPost,
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    res.json(result);
  });

module.exports = router;
