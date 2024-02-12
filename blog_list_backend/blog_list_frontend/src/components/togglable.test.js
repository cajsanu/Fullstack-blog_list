import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Togglable from "./togglable";

describe("Togglable component", () => {
  let container;
  beforeEach(() => {
    container = render(
      <Togglable hideContent="Hide" showContent="Show">
        <div className="Test">Togglable content</div>
      </Togglable>
    ).container;
  });

  test("renders its children", async () => {
    await screen.findAllByText("Togglable content");
  });
  test("at start the children are not displayed", () => {
    const div = container.querySelector(".togglable");
    expect(div).toHaveStyle("display: none");
  });
  test("after clicking the button children are displayed", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("Show");
    await user.click(button);

    const div = container.querySelector(".togglable");
    expect(div).not.toHaveStyle("display: none");
  });
  test("toggled content can be hidden again", async () => {
    const user = userEvent.setup();
    const showContentButton = screen.getByText("Show");
    await user.click(showContentButton);

    const hideContentButton = screen.getByText("Hide");
    await user.click(hideContentButton);

    const div = container.querySelector(".togglable");
    expect(div).toHaveStyle("display: none");
  });
});
