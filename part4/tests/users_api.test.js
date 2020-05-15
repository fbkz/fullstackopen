const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const helper = require("./tests_helper");
const User = require("../models/user");
const bcrypt = require("bcrypt");

beforeEach(async () => {
  await User.deleteMany({});

  let userObjects = [];
  for await (user of helper.initialUsers) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(user.password, saltRounds);
    userObjects.push({ ...user, passwordHash });
  }

  userObjects = userObjects.map((user) => new User(user));

  const promiseArray = userObjects.map((user) => user.save());
  await Promise.all(promiseArray);
});

test("passed", () => {
  expect(1).toBe(1);
});

describe("when creating a new user", () => {
  test("if a username already exists the creation fails", async () => {
    const newUser = {
      username: "g2perkz",
      password: "anotherpassowrd",
      name: "Another Winther",
    };
    result = await api.post("/api/users").send(newUser).expect(400);

    expect(result.body.error).toContain("User validation failed");
  });

  test("if a username is less than 3 characters long the creation fails", async () => {
    const newUser = {
      username: "g2",
      password: "anotherpassowrd",
      name: "G2",
    };
    result = await api.post("/api/users").send(newUser).expect(400);
    expect(result.body.error).toContain("User validation failed");
  });

  test("if a password is less than 3 characters long the creation fails", async () => {
    const newUser = {
      username: "g2jankos",
      password: "g2",
      name: "Marcin Jankowski",
    };
    result = await api.post("/api/users").send(newUser).expect(422);
    expect(result.body.error).toContain("Password validation failed");
  });
});

afterAll(() => {
  mongoose.connection.close();
});
