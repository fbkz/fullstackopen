import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import Blog from "./Blog";

test("renders title and author", () => {
  let data = {
    likes: 90,
    title: "Caps blog",
    url: "caps.com",
    author: "Jin",
  };
  let component = render(<Blog blog={data} />);

  expect(component.container).toHaveTextContent("Caps blog");
  expect(component.container).toHaveTextContent("Jin");
});

test("when clicking view button, blog's url and likes are shown", () => {
  let data = {
    likes: 90,
    title: "Caps blog",
    url: "caps.com",
    author: "Jin",
    user: {
      name: "Rasmus",
      user: "caps",
    },
  };
  let component = render(<Blog blog={data} loggedUser />);

  let button = component.getByText("view");
  fireEvent.click(button);
  expect(component.container).toHaveTextContent("caps.com");
  expect(component.container).toHaveTextContent("90");
});
