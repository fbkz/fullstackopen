import React, { useState } from "react";

const Input = ({ text, value, handleChange }) => (
  <>
    {text} <input value={value} onChange={handleChange} />
  </>
);

const SubHeader = ({ text }) => <h2>{text}</h2>;

const Number = ({ name, number }) => <li>{`${name} ${number}`}</li>;

const Numbers = ({ persons }) => {
  return (
    <ul style={{ listStyleType: "none", margin: 0, padding: 0 }}>
      {persons.map((person) => (
        <Number key={person.name} name={person.name} number={person.number} />
      ))}
    </ul>
  );
};

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456" },
    { name: "Ada Lovelace", number: "39-44-5323523" },
    { name: "Dan Abramov", number: "12-43-234345" },
    { name: "Mary Poppendieck", number: "39-23-6423122" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newSearch, setSearch] = useState("");

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
      setPersons(persons.concat({ name: newName, number: newNumber }));
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
      <SubHeader text="add a new" />
      <form onSubmit={addPerson}>
        <div>
          <Input text="name:" value={newName} handleChange={handleNameChange} />
          <br />
          <Input
            text="number:"
            value={newNumber}
            handleChange={handleNumberChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <SubHeader text="Numbers" />
      {newSearch ? (
        <Numbers persons={searchFilter()} />
      ) : (
        <Numbers persons={persons} />
      )}
    </div>
  );
};

export default App;
