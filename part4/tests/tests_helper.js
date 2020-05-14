const Blog = require("../models/blog");

const initialBlogs = [
  { title: "Caps blog", url: "caps.com", likes: 89, author: "Caps" },
  { title: "Perkz blog", url: "perkz.com", likes: 103 },
];

const initialUsers = [
  {
    username: "g2caps",
    password: "g2capspassword",
    name: "Rasmus Winther",
  },
  {
    username: "g2perkz",
    password: "g2perkzpassword",
    name: "Luka Perković",
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
  initialUsers,
};
