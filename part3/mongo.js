const mongoose = require("mongoose");

const password = process.argv[2];
const url = `mongodb+srv://fbkz:${password}@fullstackopen-yccin.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];
  const person = new Person({
    name,
    number,
  });

  person.save().then((res) => {
    console.log("");
    console.log(`added ${res.name} number ${res.number} to phonebook`);
    mongoose.connection.close();
  });
}

if (process.argv.length === 3) {
  Person.find({}).then((res) => {
    console.log("");
    console.log("phonebook:");
    res.map((person) => {
      console.log(`${person.name} ${person.number}`);
    });

    mongoose.connection.close();
  });
}
