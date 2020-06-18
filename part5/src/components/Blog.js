import React, { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, loggedUser, reRender, setReRender, handleLikeClick }) => {
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

  // let handleLikeClick = (blog) => {
  //   blogService.update({ ...blog, likes: blog.likes + 1 });
  //   setReRender(reRender + 1);
  // };

  let handleDeleteClick = async (blog) => {
    let result = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}? `
    );

    if (result) {
      await blogService.deletePost(blog.id);
      setReRender(reRender + 1);
    }
  };

  return (
    <div style={blogStyle} className="blog">
      {blog.title} {blog.author}
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
          <br />
          {loggedUser.username === blog.user.username ? (
            <button onClick={() => handleDeleteClick(blog)}>delete</button>
          ) : null}
        </>
      )}
    </div>
  );
};

export default Blog;
