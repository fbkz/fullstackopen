import React from "react";
import { useSelector, useDispatch, connect } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteList = (props) => {
  // const dispatch = useDispatch();

  // const anecdotes = useSelector((state) => {
  //   const anecdotes = state.anecdotes.filter((anecdote) =>
  //     anecdote.content.toLowerCase().includes(state.filter)
  //   );
  //   const sortedByVotes = anecdotes.sort((a, b) => b.votes - a.votes);
  //   return sortedByVotes;
  // });

  const anecdotes = () => {
    const anecdotes = props.anecdotes.filter((anecdote) =>
      anecdote.content.toLowerCase().includes(props.filter)
    );

    const sortedByVotes = anecdotes.sort((a, b) => b.votes - a.votes);
    return sortedByVotes;
  };

  const vote = (anecdote) => {
    props.voteAnecdote(anecdote);
    props.setNotification(`you voted '${anecdote.content}'`, 5);
  };

  return (
    <div>
      {anecdotes().map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    anecdotes: state.anecdotes,
    filter: state.filter,
  };
};

const mapDispatchToProps = { voteAnecdote, setNotification };

const ConnectedAnecdoteList = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList);
export default ConnectedAnecdoteList;
