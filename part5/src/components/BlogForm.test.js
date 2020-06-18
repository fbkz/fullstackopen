import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import BlogForm from "./BlogForm";

describe("<BlogForm />", () => {
  test("calls the eventhandler received as props with the right details when a new blog is called", () => {
    const createBlog = jest.fn();

    const component = render(<BlogForm createBlog={createBlog} />);

    const usernameInput = component.container.querySelector("#username");
    const authorInput = component.container.querySelector("#author");
    const urlInput = component.container.querySelector("#url");

    const form = component.container.querySelector("form");

    fireEvent.change(usernameInput, {
      target: { value: "caps" },
    });
    fireEvent.change(authorInput, {
      target: { value: "Rasmus" },
    });
    fireEvent.change(urlInput, {
      target: { value: "caps.com" },
    });

    fireEvent.submit(form);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0].title).toBe("caps");
    expect(createBlog.mock.calls[0][0].author).toBe("Rasmus");
    expect(createBlog.mock.calls[0][0].url).toBe("caps.com");
  });
});
