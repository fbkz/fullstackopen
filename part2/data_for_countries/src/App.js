import React, { useState, useEffect } from "react";
import axios from "axios";

const Input = ({ value, handleChange }) => (
  <input value={value} onChange={handleChange} />
);

const Country = ({ name, capital, population, languages, flag }) => (
  <div>
    <h2>{name}</h2>
    capital {capital} <br />
    population {population} <br />
    <h3>languages</h3>
    <ul>
      {languages.map((lang) => {
        return <li key={lang.iso639_2}>{lang.name}</li>;
      })}
    </ul>
    <img src={flag} alt={`flag of ${name}`} style={{ width: "20%" }} />
  </div>
);

const Countries = ({ countries }) =>
  countries.map((country) => (
    <li key={country.alpha3Code}> {country.name} </li>
  ));

const App = () => {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [searchResults, setSearchResults] = useState("");

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    axios.get("https://restcountries.eu/rest/v2/all").then(({ data }) => {
      setCountries(data);
    });

    const filterSearchResults = () => {
      const filterCountries = (country) => {
        const countryExists = country.name
          .toLowerCase()
          .includes(search.toLowerCase());
        if (countryExists) {
          return country;
        }
      };

      let result = countries.filter(filterCountries);
      if (result.length === 0) {
        return "No country was found";
      } else if (result.length <= 10) {
        return result;
      } else if (result.length > 10) {
        return "Too many matches, specify another filter";
      }
    };

    const filteredResults = filterSearchResults();
    setSearchResults(filteredResults);
  }, [search, countries]);

  const renderText = () => {
    if (typeof searchResults === "string") {
      return <p>{searchResults}</p>;
    }
    return null;
  };

  const renderCountries = () => {
    const arrayMultiCountries =
      searchResults.length > 1 && Array.isArray(searchResults);
    if (arrayMultiCountries) {
      return <Countries countries={searchResults} />;
    }
    return null;
  };

  const renderCountry = () => {
    const arraySingleCountry =
      searchResults.length === 1 && Array.isArray(searchResults);
    if (arraySingleCountry) {
      return (
        <Country
          name={searchResults[0].name}
          capital={searchResults[0].capital}
          population={searchResults[0].population}
          languages={searchResults[0].languages}
          flag={searchResults[0].flag}
        />
      );
    }
    return null;
  };

  return (
    <div>
      {" "}
      find countries <Input value={search} handleChange={handleSearchChange} />
      <br />
      {search && renderText()}
      {search && renderCountries()}
      {search && renderCountry()}
    </div>
  );
};

export default App;
