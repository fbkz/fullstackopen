import React, { useState } from "react";
import ReactDOM from "react-dom";

const SubHeader = ({ text }) => <h2>{text}</h2>;
const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);
const Part = ({ text, value }) => (
  <>
    {text} {value}
  </>
);
const Content = ({ good, neutral, bad }) => (
  <>
    <Part text="good" value={good} />
    <br />
    <Part text="neutral" value={neutral} />
    <br />
    <Part text="bad" value={bad} />{" "}
  </>
);

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <SubHeader text="give feedback" />
      <Button text="good" handleClick={() => setGood(good + 1)} />
      <Button text="neutral" handleClick={() => setNeutral(neutral + 1)} />
      <Button text="bad" handleClick={() => setBad(bad + 1)} />
      <SubHeader text="statistics" />
      <Content good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
