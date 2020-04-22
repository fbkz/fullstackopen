require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./mongo_for_backend");
const app = express();

app.use(cors());
app.use(express.static("build"));

morgan.token("post", function (req, res) {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :post")
);

app.use(express.json());

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }
  next(error);
};

app.get("/", (req, res) => {
  res.send("<h1>hello world!</h1>");
});

app.get("/info", (req, res) => {
  const dateNow = new Date();

  Person.estimatedDocumentCount().then((result) => {
    res.send(
      `<p>Phonebook has info for ${result} people</h1><br/><p>${dateNow.toString()}</p>`
    );
  });
});

app
  .route("/api/persons")
  .get((req, res) => {
    Person.find({}).then((result) => {
      res.json(
        result.map((result) => {
          return result.toJSON();
        })
      );
    });
  })
  .post((req, res, next) => {
    const body = req.body;

    const person = new Person({
      name: body.name,
      number: body.number,
    });

    person
      .save()
      .then((result) => {
        res.json(result.toJSON());
      })
      .catch((err) => next(err));
  });

app
  .route("/api/persons/:id")
  .get((req, res, next) => {
    const id = req.params.id;

    Person.findById(id)
      .then((result) => {
        if (result) {
          res.json(result.toJSON());
        } else {
          response.status(404).end();
        }
      })
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    const id = req.params.id;

    Person.findByIdAndRemove(id)
      .then((result) => {
        res.status(204).end();
      })
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    const person = { name: body.name, number: body.number };

    Person.findByIdAndUpdate(id, person, {
      new: true,
      runValidators: true,
      context: "query",
    })
      .then((result) => {
        res.json(result.toJSON());
      })
      .catch((err) => next(err));
  });

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
