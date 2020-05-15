const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const helper = require("./tests_helper");
const Blog = require("../models/blog");
const User = require("../models/user");

beforeEach(async () => {
  await Blog.deleteMany({});

  const user = await User.findOne({ username: "g2caps" });
  const blogObjects = helper.initialBlogs.map(
    (blog) => new Blog({ ...blog, user: user._id })
  );
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe("when there is initially some blogs saved", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const res = await api.get("/api/blogs");
    expect(res.body).toHaveLength(helper.initialBlogs.length);
  });

  test("property 'id' of a returned object exists", async () => {
    const res = await api.get("/api/blogs");
    expect(res.body[0].id).toBeDefined();
  });
});

describe("when adding new blogs to /api/blogs", () => {
  test("post request creates a new blog in the db and the total number increases by 1", async () => {
    const newBlog = { title: "Mikyx blog", url: "mikyx.com", likes: 201 };

    const user = {
      username: "g2caps",
      password: "g2capspassword",
    };

    const userLoggedIn = (await api.post("/api/login").send(user)).body;

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${userLoggedIn.token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const contents = blogsAtEnd.map((blog) => blog.title);
    expect(contents).toContain(newBlog.title);
  });

  test("if a post request has the property 'likes' missing default it to 0 in the db", async () => {
    const newBlog = { title: "Jankos blog", url: "jankos.com" };
    const user = {
      username: "g2caps",
      password: "g2capspassword",
    };

    const userLoggedIn = (await api.post("/api/login").send(user)).body;

    const res = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${userLoggedIn.token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    expect(res.body.likes).toBe(0);
  });

  test("a post request object must have 'title' and 'url' properties", async () => {
    const newBlog = { author: "Jankos" };
    const user = {
      username: "g2caps",
      password: "g2capspassword",
    };

    const userLoggedIn = (await api.post("/api/login").send(user)).body;

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${userLoggedIn.token}`)
      .send(newBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("when the token is not provided the post request fails", async () => {
    const newBlog = { title: "Mikyx blog", url: "mikyx.com", likes: 201 };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });
});

describe("when making a delete request to /api/blogs/:id", () => {
  test("the resource is deleted and the 204 is received on the client", async () => {
    const user = {
      username: "g2caps",
      password: "g2capspassword",
    };

    const userLoggedIn = (await api.post("/api/login").send(user)).body;
    const blogId = (await helper.blogsInDb())[0].id;
    await api
      .delete(`/api/blogs/${blogId}`)
      .set("Authorization", `Bearer ${userLoggedIn.token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
  });
});

describe("when updating a unique resource", () => {
  test("if the 'author' property is being updated on an object that doesn't have it, create it", async () => {
    const { author, id: blogId } = (await helper.blogsInDb())[1];
    expect(author).toBe(undefined);

    const updateBlog = { author: "Perkz" };
    const result = (await api.put(`/api/blogs/${blogId}`).send(updateBlog))
      .body;

    expect(result.author).toContain(updateBlog.author);
  });

  test("an existing property is updated successfully", async () => {
    const { id: blogId, likes } = (await helper.blogsInDb())[0];
    const updateBlog = { likes: likes + 1 };
    const result = (await api.put(`/api/blogs/${blogId}`).send(updateBlog))
      .body;

    expect(result.likes).toBe(likes + 1);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
