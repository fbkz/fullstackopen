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

const voteAnecdote = async (anecdote) => {
  await axios.put(`${baseUrl}/${anecdote.id}`, {
    ...anecdote,
    votes: anecdote.votes + 1,
  });
};

export default { getAll, createAnecdote, voteAnecdote };
