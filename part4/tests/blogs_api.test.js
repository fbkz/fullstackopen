const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const helper = require("./tests_helper");
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test("blogs list is returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("length of the blogs list is correct", async () => {
  const res = await api.get("/api/blogs");
  expect(res.body).toHaveLength(helper.initialBlogs.length);
});

test("property id of returned blog object exists", async () => {
  const res = await api.get("/api/blogs");
  expect(res.body[0].id).toBeDefined();
});

test("http post to /api/blogs creates a new blog, total number increases by 1 and the new content is in the db", async () => {
  const newBlog = { title: "Mikyx blog", url: "mikyx.com", likes: 201 };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const contents = blogsAtEnd.map((blog) => blog.title);
  expect(contents).toContain(newBlog.title);
});

afterAll(() => {
  mongoose.connection.close();
});

test("if a post request has the property 'likes' missing default it to 0", async () => {
  const newBlog = { title: "Jankos blog", url: "jankos.com" };

  const res = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  expect(res.body.likes).toBe(0);
});

test("a post request object must have 'title' and 'url' properties", async () => {
  const newBlog = { author: "Jankos" };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(400)
    .expect("Content-Type", /application\/json/);
});
