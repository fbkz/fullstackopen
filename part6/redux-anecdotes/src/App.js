import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { voteAnecdote, addAnecdote } from "./reducers/anecdoteReducer";

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const anecdotes = useSelector((state) => {
    const sortedByVotes = state.sort((a, b) => b.votes - a.votes);
    return sortedByVotes;
  });
  const dispatch = useDispatch();

  const vote = (id) => {
    console.log("vote", id);
    dispatch(voteAnecdote(id));
  };

  const handleAddAnecdote = (e) => {
    e.preventDefault();
    dispatch(addAnecdote(inputValue));
    setInputValue("");
  };

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
      <h2>create new</h2>
      <form onSubmit={handleAddAnecdote}>
        <div>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <button>create</button>
      </form>
    </div>
  );
};

export default App;
