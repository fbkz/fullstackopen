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

export const setNotification = (message) => {
  return {
    type: "SET_NOTIFICATION",
    data: {
      message,
    },
  };
};

export const removeNotification = () => {
  return {
    type: "DELETE_NOTIFICATION",
  };
};

export default reducer;
