import React, { useState } from "react";
import ReactDOM from "react-dom";

const SubHeader = ({ text }) => <h2>{text}</h2>;

const Button = ({ text, handleclick }) => (
  <button onClick={handleclick}>{text}</button>
);

const Anecdote = ({ anecdotes, index }) => <>{anecdotes[index]}</>;

const Votes = ({ votes, index }) => {
  if (votes[index] === 1) {
    return (
      <>
        <br />
        has {votes[index]} vote
      </>
    );
  }
  return (
    <>
      <br />
      has {votes[index]} votes
    </>
  );
};

const App = (props) => {
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));

  const randomSelection = () => {
    let maxNumber = anecdotes.length;
    let randomNumber = Math.floor(Math.random() * maxNumber);
    setSelected(randomNumber);
  };

  const handleVote = () => {
    let votesCopy = [...votes];
    votesCopy[selected] += 1;
    setVotes(votesCopy);
  };

  const findMostVoted = (arr) => arr.indexOf(Math.max(...arr));
  const iMostVoted = findMostVoted(votes);
  const sumVotes = votes.reduce((acc, curr) => acc + curr, 0);

  return (
    <div>
      <SubHeader text="Anecdote of the day" />
      <Anecdote anecdotes={anecdotes} index={selected} />
      <Votes votes={votes} index={selected} />
      <br />
      <Button handleclick={handleVote} text="vote" />
      <Button handleclick={randomSelection} text="next anecdote" />
      {sumVotes === 0 ? null : (
        <>
          <SubHeader text="Anecdote with most votes" />
          <Anecdote anecdotes={anecdotes} index={iMostVoted} />
          <Votes votes={votes} index={iMostVoted} />
        </>
      )}
    </div>
  );
};

const anecdotes = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById("root"));
