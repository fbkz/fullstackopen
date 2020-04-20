import React, { useState, useEffect } from "react";
import axios from "axios";

const Input = ({ text, value, handleChange }) => (
  <>
    {text} <input value={value} onChange={handleChange} />
  </>
);

const PersonForm = ({
  handleSubmit,
  name,
  handleNameChange,
  number,
  handleNumberChange,
}) => (
  <form onSubmit={handleSubmit}>
    <div>
      <Input text="name:" value={name} handleChange={handleNameChange} />
      <br />
      <Input text="number:" value={number} handleChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const SubHeader = ({ text }) => <h2>{text}</h2>;

const Person = ({ name, number }) => <li>{`${name} ${number}`}</li>;

const Persons = ({ persons }) => {
  return (
    <ul style={{ listStyleType: "none", margin: 0, padding: 0 }}>
      {persons.map((person) => (
        <Person key={person.name} name={person.name} number={person.number} />
      ))}
    </ul>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newSearch, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then(({ data }) => {
      setPersons(data);
    });
  }, []);

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const addPerson = (e) => {
    e.preventDefault();

    const personExists = ({ name }) => name === newName;
    const result = persons.find(personExists);

    if (result === undefined) {
      const newPerson = { name: newName, number: newNumber };
      axios.post("http://localhost:3001/persons", newPerson);

      setPersons(persons.concat(newPerson));
      setNewName("");
      setNewNumber("");
      return;
    }

    alert(`${newName} is already added to phonebook`);
  };

  const searchFilter = () => {
    const searchPerson = (person) =>
      person.name.toLowerCase().includes(newSearch.toLocaleLowerCase());
    return persons.filter(searchPerson);
  };

  return (
    <div>
      <SubHeader text="Phonebook" />
      <Input
        text="filter shown with"
        value={newSearch}
        handleChange={handleSearchChange}
      />
      <h3>add a new</h3>
      <PersonForm
        handleSubmit={addPerson}
        name={newName}
        handleNameChange={handleNameChange}
        number={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <SubHeader text="Numbers" />
      {newSearch ? (
        <Persons persons={searchFilter()} />
      ) : (
        <Persons persons={persons} />
      )}
    </div>
  );
};

export default App;
