const reducer = (state = "", action) => {
  switch (action.type) {
    case "SET_NOTIFICATION":
      const message = action.data.message;
      return message;
    case "DELETE_NOTIFICATION":
      return "";
    default:
      return state;
  }
};

export default reducer;
