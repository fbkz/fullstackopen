const reducer = (state = "", action) => {
  switch (action.type) {
    case "SET_FILTER":
      const message = action.data.message;
      return message;
    default:
      return state;
  }
};

export const setFilter = (message) => {
  return {
    type: "SET_FILTER",
    data: {
      message,
    },
  };
};

export default reducer;
