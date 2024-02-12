import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./blog";

test("Renders content", () => {
  const blog = {
    title: "Testing react app",
    author: "Unknown",
    url: "silly.berry",
  };
  render(<Blog title={blog.title} author={blog.author} url={blog.url} />);
  const renderdTitle = screen.getByText("Testing react app", {exact: false});
  console.log(renderdTitle)
  expect(renderdTitle).toBeDefined();
});

test("Cklicking like-button twice calls event handler twice", async () => {
  const blog = {
    title: "Testing react app",
    author: "Unknown",
    url: "silly.berry",
  };
  const mockHandler = jest.fn();
  render(
    <Blog
      title={blog.title}
      author={blog.author}
      url={blog.url}
      onLikeClick={mockHandler}
    />
  );
  const user = userEvent.setup();
  const button = screen.getByText("Like");
  await user.click(button);
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2);
});
