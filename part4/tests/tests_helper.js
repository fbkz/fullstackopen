const Blog = require("../models/blog");

const initialBlogs = [
  { title: "Caps blog", url: "caps.com", likes: 89 },
  { title: "Perkz blog", url: "perkz.com", likes: 103 },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
};
