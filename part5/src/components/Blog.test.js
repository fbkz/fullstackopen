import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import Blog from "./Blog";

test("renders title and author", () => {
  let data = { likes: 90, title: "Caps blog", url: "caps.com", author: "Jin" };
  let component = render(<Blog blog={data} />);

  expect(component.container).toHaveTextContent("Caps blog");
  expect(component.container).toHaveTextContent("Jin");
});
