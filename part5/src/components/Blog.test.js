import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import Blog from "./Blog";

describe("<Blog/>", () => {
  let component;
  let mockHandler = jest.fn();
  beforeEach(() => {
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
    component = render(
      <Blog blog={data} loggedUser handleLikeClick={mockHandler} />
    );
  });

  test("renders title and author", () => {
    expect(component.container).toHaveTextContent("Caps blog");
    expect(component.container).toHaveTextContent("Jin");
  });

  test("when clicking view button, blog's url and likes are shown", () => {
    let button = component.getByText("view");
    fireEvent.click(button);
    expect(component.container).toHaveTextContent("caps.com");
    expect(component.container).toHaveTextContent("90");
  });

  test("when clicking twice on the like button, it's called twice", () => {
    let button = component.getByText("view");
    fireEvent.click(button);

    let likeBtn = component.getByText("like");
    fireEvent.click(likeBtn);
    fireEvent.click(likeBtn);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
