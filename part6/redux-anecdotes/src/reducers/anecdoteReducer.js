import anecdoteService from "../services/anecdotes";

const reducer = (state = [], action) => {
  switch (action.type) {
    case "INIT_ANECDOTES":
      return action.data;
    case "NEW_ANECDOTE":
      const newAnecdote = action.data;
      return [...state, newAnecdote];
    case "VOTE":
      const id = action.data.anecdote.id;
      const anecdoteToVote = state.find((anecdote) => anecdote.id === id);
      const voteAnecdote = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1,
      };
      const newState = state.map((anecdote) =>
        anecdote.id === id ? voteAnecdote : anecdote
      );
      return newState;
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
    const newAnecdote = await anecdoteService.createAnecdote(anecdote);
    dispatch({
      type: "NEW_ANECDOTE",
      data: newAnecdote,
    });
  };
};

export const voteAnecdote = (anecdote) => {
  return async (dispatch) => {
    await anecdoteService.voteAnecdote(anecdote);
    dispatch({
      type: "VOTE",
      data: {
        anecdote,
      },
    });
  };
};

export default reducer;
