import React, { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notifications from "./components/Notifications";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" });
  const [notifications, setNotifications] = useState(null);

  const loginForm = () => (
    <div>
      <h2>login to application</h2>
      {notifications != null && (
        <Notifications
          message={notifications.message}
          error={notifications.error}
        />
      )}

      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      if (notifications) {
        setNotifications(null);
      }
    } catch (error) {
      setNotifications({ message: error.response.data.error, error: true });
    }
  };

  const blogsForm = () => (
    <div>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type="text"
            value={newBlog.title}
            name="Username"
            onChange={({ target }) =>
              setNewBlog({ ...newBlog, title: target.value })
            }
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={newBlog.author}
            name="Username"
            onChange={({ target }) =>
              setNewBlog({ ...newBlog, author: target.value })
            }
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={newBlog.url}
            name="Username"
            onChange={({ target }) =>
              setNewBlog({ ...newBlog, url: target.value })
            }
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );

  const addBlog = (event) => {
    event.preventDefault();
    const blogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
    };

    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog));
      setNewBlog({ title: "", author: "", url: "" });
      setNotifications({
        message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        error: false,
      });
      setTimeout(() => {
        setNotifications(null);
      }, 5000);
    });
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
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  return (
    <div>
      {user == null && loginForm()}
      {user != null && (
        <div>
          <h2>blogs</h2>
          {notifications != null && (
            <Notifications
              message={notifications.message}
              error={notifications.error}
            />
          )}

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
          <h2>create new</h2>
          {blogsForm()}
        </div>
      )}
      {user != null && blogs.map((blog) => <Blog key={blog.id} blog={blog} />)}
    </div>
  );
};

export default App;
