import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const getAll = async () => {
  const anecdotes = (await axios.get(baseUrl)).data;
  return anecdotes;
};

const createAnecdote = async (anecdote) => {
  const newAnecdote = { content: anecdote, votes: 0 };
  const response = (await axios.post(baseUrl, newAnecdote)).data;
  return response;
};

export default { getAll, createAnecdote };
