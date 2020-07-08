import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addAnecdote } from "../reducers/anecdoteReducer";

const AnecdoteForm = () => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");

  const handleAddAnecdote = (e) => {
    e.preventDefault();
    dispatch(addAnecdote(inputValue));
    setInputValue("");
  };

  return (
    <>
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
    </>
  );
};

export default AnecdoteForm;
