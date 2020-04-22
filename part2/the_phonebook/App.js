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

const Notifications = ({ message, error }) => {
  const styling = {
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  };

  if (error) {
    styling.color = "red";
    return <p style={styling}>{message}</p>;
  } else {
    styling.color = "green";
    return <p style={styling}>{message}</p>;
  }
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newSearch, setSearch] = useState("");
  const [notifications, setNotifications] = useState("");

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

    const searchPerson = ({ name }) => name === newName;
    const personExists = persons.find(searchPerson);
    if (personExists) {
      const changeNumberConfirm = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );
      if (changeNumberConfirm) {
        personService
          .update(personExists.id, {
            ...personExists,
            number: newNumber,
          })
          .then((res) => {
            if (res.status === 200) {
              let index = persons.indexOf(personExists);
              let updatedPersons = [...persons];
              updatedPersons.splice(index, 1, res.data);
              setPersons(updatedPersons);
            }
          })
          .catch((err) => console.log(err));
      }
    } else {
      const newPerson = { name: newName, number: newNumber };
      personService
        .create(newPerson)
        .then(({ data }) => {
          setPersons(persons.concat(data));
          setNewName("");
          setNewNumber("");
          setNotifications({ message: `Added ${newName}`, error: false });
          setTimeout(() => {
            setNotifications(null);
          }, 5000);
        })
        .catch((err) =>
          setNotifications({ message: err.response.data.error, error: true })
        );

      return;
    }
  };

  const deletePerson = (person) => {
    const deleteConfirmation = window.confirm(`Delete ${person.name}?`);
    if (deleteConfirmation) {
      personService
        .deleteObj(person.id)
        .then((res) => {
          if (res.status === 204) {
            const updateState = persons.filter((x) => !(x.id === person.id));
            setPersons(updateState);
          }
        })
        .catch((err) => {
          setNotifications({
            message: `${person.name} was already removed from the server`,
            error: true,
          });
          setTimeout(() => {
            setNotifications(null);
          }, 5000);
        });
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
      {notifications ? (
        <Notifications
          message={notifications.message}
          error={notifications.error}
        />
      ) : null}{" "}
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
        <Persons persons={searchFilter()} deletePerson={deletePerson} />
      ) : (
        <Persons persons={persons} deletePerson={deletePerson} />
      )}
    </div>
  );
};

export default App;
