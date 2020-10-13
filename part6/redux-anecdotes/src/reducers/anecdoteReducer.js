import anecdoteService from "../services/anecdotes";

const reducer = (state = [], action) => {
  // console.log("state now: ", state);
  // console.log("action", action);

  switch (action.type) {
    case "INIT_ANECDOTES":
      return action.data;
    case "VOTE":
      const id = action.data.id;
      const anecdoteToChange = state.find((anecdote) => anecdote.id === id);
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1,
      };

      const newState = state.map((anecdote) =>
        anecdote.id === id ? changedAnecdote : anecdote
      );
      return newState;
    case "NEW_ANECDOTE":
      const newAnecdote = action.data;
      return [...state, newAnecdote];

    default:
      return state;
  }
};

export const initAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch({
      type: "INIT_ANECDOTES",
      data: anecdotes,
    });
  };
};

export const addAnecdote = (anecdote) => {
  return async (dispatch) => {
    console.log(dispatch);
    const newAnecdote = await anecdoteService.createAnecdote(anecdote);
    dispatch({
      type: "NEW_ANECDOTE",
      data: newAnecdote,
    });
  };
};

export const voteAnecdote = (id) => {
  return {
    type: "VOTE",
    data: {
      id,
    },
  };
};

export default reducer;
