const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

router
  .route("/")
  .get(async (req, res) => {
    const blogs = await Blog.find({}).populate("user", {
      name: 1,
      username: 1,
    });

    res.json(blogs);
  })
  .post(async (req, res) => {
    const {
      token,
      body: { title, url, likes, author },
    } = req;

    const decodedToken = jwt.verify(token, config.SECRET);

    const user = await User.findById(decodedToken.id);

    const blogPost = {
      title,
      url,
      likes,
      user: user._id,
      author,
    };

    const parsedBlogPost = JSON.parse(JSON.stringify(blogPost));
    const blog = new Blog(parsedBlogPost);
    const result = await blog.save();

    user.blogs = user.blogs.concat(result._id);
    await user.save();

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
    const blog = await Blog.findById(req.params.id);

    const { token } = req;
    const decodedToken = jwt.verify(token, config.SECRET);

    if (String(blog.user) == decodedToken.id) {
      await Blog.findByIdAndRemove(req.params.id);
      res.status(204).end();
    } else {
      res.status(403).json({
        error:
          "you don't have permissions to delete content that does not belong to you",
      });
    }
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

function getTokenFrom(request) {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.slice(7);
  }
  return null;
}

module.exports = router;
