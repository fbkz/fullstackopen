const config = require("./utils/config");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const morgan = require("morgan");
require("express-async-errors");

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

app.use(cors());
app.use(express.json());
app.use(tokenExtractor);
app.use(morgan("tiny"));
app.use("/api/login", require("./controllers/login"));
app.use("/api/users", require("./controllers/users"));
app.use("/api/blogs", require("./controllers/blogs"));
if (process.env.NODE_ENV === "test") {
  app.use("/api/testing", require("./controllers/resetdb"));
}

app.use(errorHandler);

function errorHandler(error, request, response, next) {
  if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  } else if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "SyntaxError") {
    return response.status(400).send({ error: "malformatted syntax" });
  } else if (
    error.message === "invalid token" ||
    error.message === "jwt malformed"
  ) {
    return response.status(401).json({ error: "token is invalid" });
  } else if (error.message === "jwt must be provided") {
    return response.status(401).json({ error: "token is missing " });
  }

  next(error);
}

function tokenExtractor(request, response, next) {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    request.token = authorization.slice(7);
  }
  next();
}

module.exports = app;
