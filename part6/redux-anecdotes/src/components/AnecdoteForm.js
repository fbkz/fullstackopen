import React, { useState } from "react";
import { useDispatch, connect } from "react-redux";
import { addAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteForm = (props) => {
  // const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");

  const handleAddAnecdote = async (e) => {
    e.preventDefault();
    props.addAnecdote(inputValue);
    props.setNotification(`new anecdote '${inputValue}'`, 5);
    setInputValue("");
  };

  return (
    <div>
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

const mapDispatchToProps = { addAnecdote, setNotification };

const ConnectedAnecdoteForm = connect(null, mapDispatchToProps)(AnecdoteForm);
export default ConnectedAnecdoteForm;
