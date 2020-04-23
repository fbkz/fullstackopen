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

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }

  const result = blogs.reduce((acc, blog) => {
    if (!acc.hasOwnProperty(blog.author)) {
      acc[blog.author] = 1;
    } else {
      acc[blog.author] += 1;
    }

    return acc;
  }, {});

  const author = Object.keys(result).reduce((acc, author) => {
    return result[author] > result[acc] ? author : acc;
  });

  return { author, blogs: result[author] };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }

  const result = blogs.reduce((acc, blog) => {
    if (!acc.hasOwnProperty(blog.author)) {
      acc[blog.author] = blog.likes;
    } else {
      acc[blog.author] += blog.likes;
    }

    return acc;
  }, {});

  const author = Object.keys(result).reduce((acc, author) => {
    return result[author] > result[acc] ? author : acc;
  });

  return { author, likes: result[author] };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
