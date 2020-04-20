const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(morgan("tiny"));
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
    res.json(persons);
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

    const personSearch = (person) => person.name === body.name;
    const personExists = persons.find(personSearch);
    if (personExists) {
      return res.status(400).json({
        error: "name must be unique",
      });
    }

    const person = {
      name: body.name,
      number: body.number,
      id: Math.floor(Math.random() * Math.floor(500000)),
    };

    persons = persons.concat(person);
    res.json(person);
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
    const id = +req.params.id;
    const filterPersons = (person) => !(person.id === id);
    persons = persons.filter(filterPersons);
    res.status(204).end();
  });

const PORT = 3003;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
