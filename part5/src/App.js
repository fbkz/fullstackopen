import React, { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notifications from "./components/Notifications";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [forceReRender, setForceReRender] = useState(0);

  const blogFormRef = useRef(null);

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);

      if (notifications) {
        setNotifications(null);
      }
    } catch (error) {
      setNotifications({ message: error.response.data.error, error: true });
    }
  };

  const addBlog = async (blogObj) => {
    let returnedBlog = await blogService.create(blogObj);
    let hasIdProperty = Object.prototype.hasOwnProperty.call(
      returnedBlog,
      "id"
    );
    if (hasIdProperty) {
      setBlogs(blogs.concat(returnedBlog));
      setForceReRender(forceReRender + 1);
      blogFormRef.current.toggleVisibility();
      setNotifications({
        message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        error: false,
      });
      setTimeout(() => {
        setNotifications(null);
      }, 5000);
    } else {
      setNotifications({ message: returnedBlog.data.error, error: true });
      setTimeout(() => {
        setNotifications(null);
      }, 5000);
    }
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      let sortedByLikes = blogs.sort((a, b) => b.likes - a.likes);
      setBlogs(sortedByLikes);
    });
  }, [forceReRender]);

  let handleLikeClick = (blog) => {
    blogService.update({ ...blog, likes: blog.likes + 1 });
    setForceReRender(forceReRender + 1);
  };

  return (
    <div>
      {notifications !== null ? (
        <Notifications
          message={notifications.message}
          error={notifications.error}
        />
      ) : null}
      {user == null && <LoginForm handleUserLogin={handleLogin} />}
      {user != null && (
        <div>
          <h2>blogs</h2>

          <p>
            {user.name} logged in{" "}
            <button
              onClick={() => {
                window.localStorage.removeItem("loggedUser");
                setUser(null);
              }}
            >
              logout
            </button>
          </p>

          <Togglable buttonLabel={"new blog"} ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
        </div>
      )}
      {user != null &&
        blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            setReRender={setForceReRender}
            reRender={forceReRender}
            loggedUser={user}
            handleLikeClick={handleLikeClick}
          />
        ))}
    </div>
  );
};

export default App;
