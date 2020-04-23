const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => {
    return blog.likes + total;
  }, 0);
};

module.exports = {
  dummy,
  totalLikes,
};
