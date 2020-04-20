import React, { useState, useEffect } from "react";
import personService from "./services/persons";

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

const Person = ({ name, number, handleClick }) => (
  <li>
    {`${name} ${number}`} <button onClick={() => handleClick()}>delete</button>{" "}
  </li>
);

const Persons = ({ persons, deletePerson }) => {
  return (
    <ul style={{ listStyleType: "none", margin: 0, padding: 0 }}>
      {persons.map((person) => (
        <Person
          key={person.name}
          name={person.name}
          number={person.number}
          handleClick={() => deletePerson(person)}
        />
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
    personService.getAll().then(({ data }) => setPersons(data));
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
      personService.create(newPerson).then(({ data }) => {
        setPersons(persons.concat(data));
        setNewName("");
        setNewNumber("");
      });

      return;
    }

    alert(`${newName} is already added to phonebook`);
  };

  const deletePerson = (person) => {
    const deleteConfirmation = window.confirm(`Delete ${person.name}?`);
    if (deleteConfirmation) {
      personService
        .deleteObj(person.id)
        .then((res) => {
          if (res.status === 200) {
            const updateState = persons.filter((x) => !(x.id === person.id));
            setPersons(updateState);
          }
        })
        .catch(console.error);
    }
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
        <Persons persons={persons} deletePerson={deletePerson} />
      )}
    </div>
  );
};

export default App;
