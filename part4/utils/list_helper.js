const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => {
    return blog.likes + total;
  }, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }

  const mostLiked = blogs.reduce((acc, blog) => {
    return blog.likes > acc.likes ? blog : acc;
  });

  return {
    title: mostLiked.title,
    author: mostLiked.author,
    likes: mostLiked.likes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
