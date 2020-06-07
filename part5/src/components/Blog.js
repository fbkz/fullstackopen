import React, { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, setReRender, reRender }) => {
  const [isOpen, setIsOpen] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  let handleClick = () => {
    setIsOpen(!isOpen);
  };

  let handleLikeClick = (blog) => {
    blogService.update({ ...blog, likes: blog.likes + 1 });
    setReRender(reRender + 1);
  };

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}{" "}
      <button onClick={handleClick}>{isOpen ? "hide" : "view"}</button>
      {isOpen && (
        <>
          <br />
          {blog.url}
          <br />
          {blog.likes}{" "}
          <button onClick={() => handleLikeClick(blog)}>like</button>
          <br />
          {blog.user.name}
        </>
      )}
    </div>
  );
};

export default Blog;
