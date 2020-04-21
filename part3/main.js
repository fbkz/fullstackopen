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

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/", (req, res) => {
  res.send("<h1>hello world!</h1>");
});

app.get("/info", (req, res) => {
  const dateNow = new Date();

  res.send(
    `<p>Phonebook has info for ${
      persons.length
    } people</h1><br/><p>${dateNow.toString()}</p>`
  );
});

app
  .route("/api/persons")
  .get((req, res) => {
    Person.find({}).then((persons) => {
      res.json(
        persons.map((person) => {
          return person.toJSON();
        })
      );
    });
  })
  .post((req, res) => {
    const body = req.body;

    const propertiesMissing = !body.name && !body.number;
    if (propertiesMissing) {
      return res.status(400).json({
        error: "name and number are missing",
      });
    } else if (!body.name) {
      return res.status(400).json({
        error: "name is missing",
      });
    } else if (!body.number) {
      return res.status(400).json({
        error: "number is missing",
      });
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    });

    person.save().then((result) => {
      res.json(result.toJSON());
    });
  });

app
  .route("/api/persons/:id")
  .get((req, res) => {
    const id = +req.params.id;
    const personExists = (person) => person.id === id;
    const person = persons.find(personExists);

    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  })
  .delete((req, res) => {
    const id = req.params.id;

    Person.findByIdAndRemove(id)
      .then((result) => {
        res.status(204).end();
      })
      .catch((err) => console.log(err));
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
