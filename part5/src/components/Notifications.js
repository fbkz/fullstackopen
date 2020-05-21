import React from "react";

const Notifications = ({ message, error }) => {
  const styling = {
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  };

  if (error) {
    styling.color = "red";
    return <p style={styling}>{message}</p>;
  } else {
    styling.color = "green";
    return <p style={styling}>{message}</p>;
  }
};

export default Notifications;
