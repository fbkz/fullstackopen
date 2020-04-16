import React, { useState } from "react";
import ReactDOM from "react-dom";

const SubHeader = ({ text }) => <h2>{text}</h2>;
const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);
const Part = ({ text, value, symbol }) => (
  <>
    {text} {value} {symbol}
    <br />
  </>
);
const Content = ({ good, neutral, bad, total, average, positivePerc }) => (
  <>
    <Part text="good" value={good} />
    <Part text="neutral" value={neutral} />
    <Part text="bad" value={bad} />
    <Part text="all" value={total} />
    <Part text="average" value={average} />
    <Part text="positive" value={positivePerc} symbol="%" />
  </>
);

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const total = good + neutral + bad;
  const average = (good - bad) / total || 0;
  const positivePerc = (good / total) * 100 || 0;

  return (
    <div>
      <SubHeader text="give feedback" />
      <Button text="good" handleClick={() => setGood(good + 1)} />
      <Button text="neutral" handleClick={() => setNeutral(neutral + 1)} />
      <Button text="bad" handleClick={() => setBad(bad + 1)} />
      <SubHeader text="statistics" />
      <Content
        good={good}
        neutral={neutral}
        bad={bad}
        total={total}
        average={average}
        positivePerc={positivePerc}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
