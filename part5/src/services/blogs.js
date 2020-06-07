import axios from "axios";
const baseUrl = "/api/blogs";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const create = async (blogObject) => {
  const config = { headers: { Authorization: token } };
  try {
    const response = await axios.post(baseUrl, blogObject, config);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

const update = async (blogObject) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.put(
    `${baseUrl}\\${blogObject.id}`,
    blogObject,
    config
  );

  // return response.data;
};

export default { getAll, create, setToken, update };
