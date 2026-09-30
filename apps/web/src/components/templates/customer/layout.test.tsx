import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { MemoryRouter, useLocation } from "react-router-dom";
import RootReducer from "../../../reducers";
import CustomerLayout from "./layout";

const CurrentPath = () => {
  const location = useLocation();
  return <span data-testid="current-path">{location.pathname}</span>;
};

afterEach(cleanup);

describe("CustomerLayout", () => {
  it("renders the book banner and navigates through the customer bottom bar", () => {
    render(
      <Provider store={createStore(RootReducer)}>
        <MemoryRouter initialEntries={["/customer/book"]}>
          <CustomerLayout type="book">
            <main>Menu categories</main>
          </CustomerLayout>
          <CurrentPath />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText("Menu categories")).toBeTruthy();
    expect(screen.getByAltText("banner-book")).toBeTruthy();
    fireEvent.click(screen.getByRole("link", { name: "Cart" }));
    expect(screen.getByTestId("current-path").textContent).toBe(
      "/customer/cart",
    );
  });

  it("renders the menu title and links back to the book route", () => {
    render(
      <Provider store={createStore(RootReducer)}>
        <MemoryRouter>
          <CustomerLayout type="menu" title="Coffee">
            <main>Menu items</main>
          </CustomerLayout>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText("Coffee")).toBeTruthy();
    expect(screen.getByText("Menu items")).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Back" }).getAttribute("href"),
    ).toBe("/customer/book");
  });
});
