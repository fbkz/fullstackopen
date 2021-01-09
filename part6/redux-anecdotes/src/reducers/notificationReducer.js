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

let timeoutId;

export const setNotification = (message, time) => {
  return async (dispatch) => {
    dispatch({
      type: "SET_NOTIFICATION",
      data: {
        message,
      },
    });
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      dispatch(removeNotification());
    }, time * 1000);
  };
};

export const removeNotification = () => {
  return {
    type: "DELETE_NOTIFICATION",
  };
};

export default reducer;
