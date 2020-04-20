import React, { useState, useEffect } from "react";
import axios from "axios";

const Input = ({ value, handleChange }) => (
  <input value={value} onChange={handleChange} />
);

const Country = ({ name, capital, population, languages, flag }) => {
  const [weather, setWeather] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("");

  useEffect(() => {
    let mounted = true;
    const weatherURL = `https://api.weatherapi.com/v1/current.json?key=${process.env.REACT_APP_WEATHER_KEY}&q=${capital}`;

    fetch(weatherURL)
      .then((res) => res.json())
      .then((data) => {
        if (mounted) {
          setWeather(data.current);
          setWeatherIcon(data.current.condition);
        }
      });

    return () => (mounted = false);
  }, [capital]);

  return (
    <div>
      <h2>{name}</h2>
      capital {capital} <br />
      population {population} <br />
      <h3>Spoken languages</h3>
      <ul>
        {languages.map((lang) => {
          return <li key={lang.iso639_2}>{lang.name}</li>;
        })}
      </ul>
      <img src={flag} alt={`flag of ${name}`} style={{ width: "20%" }} />
      <h3>Weather in {capital}</h3> <br />
      <b>temperature</b>: {weather.temp_c} Celsius <br />
      <img
        src={`http:${weatherIcon.icon}`}
        alt={`http:${weatherIcon.text}`}
      />{" "}
      <br />
      <b>wind</b>: {weather.wind_mph} mph direction {weather.wind_dir}
    </div>
  );
};

const Countries = ({ countries, handleClick }) =>
  countries.map((country) => (
    <li key={country.alpha3Code}>
      {" "}
      {country.name}{" "}
      <button onClick={() => handleClick([country])}>show</button>{" "}
    </li>
  ));

const App = () => {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState("");

  useEffect(() => {
    axios.get("https://restcountries.eu/rest/v2/all").then(({ data }) => {
      setCountries(data);
    });
  }, []);

  const handleSearchChange = (e) => {
    setCountry("");
    setSearchResults("");
    setSearch(e.target.value);
  };

  useEffect(() => {
    const filterSearch = () => {
      const filterSearchCB = (country) => {
        return country.name.toLowerCase().includes(search.toLowerCase());
      };
      const results = countries.filter(filterSearchCB);

      if (results.length === 1) {
        setCountry(results);
      } else if (results.length > 1 && results.length < 11) {
        setSearchResults(results);
      }
    };

    filterSearch();
  }, [countries, search]);

  return (
    <div>
      find countries <Input value={search} handleChange={handleSearchChange} />
      <br />
      {search && !country && !searchResults ? (
        <p>Too many matches, specify another filter</p>
      ) : null}
      {country ? (
        <Country
          name={country[0].name}
          capital={country[0].capital}
          population={country[0].population}
          languages={country[0].languages}
          flag={country[0].flag}
        />
      ) : searchResults ? (
        <Countries countries={searchResults} handleClick={setCountry} />
      ) : null}
    </div>
  );
};

export default App;
