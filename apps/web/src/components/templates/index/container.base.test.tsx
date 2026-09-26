import { render, screen } from "@testing-library/react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import RootReducer from "../../../reducers";
import ContainerBase from "./container.base";

describe("LandingContainerBase", () => {
  it("sets the document title and shows guest navigation", () => {
    const store = createStore(RootReducer);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ContainerBase title="LandingPage">Landing content</ContainerBase>
        </MemoryRouter>
      </Provider>,
    );

    expect(document.title).toBe("LandingPage");
    expect(screen.getByText("Landing content")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Customer" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Login" })).toBeTruthy();
  });
});
