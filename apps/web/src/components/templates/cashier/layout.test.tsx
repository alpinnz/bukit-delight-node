import { render, screen, fireEvent } from "@testing-library/react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";
import RootReducer from "../../../reducers";
import CashierLayout from "./layout";

const CurrentPath = () => {
  const location = useLocation();
  return <span data-testid="current-path">{location.pathname}</span>;
};

describe("CashierLayout", () => {
  it("sets the page title and navigates using the cashier links", () => {
    const store = createStore(RootReducer);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/cashier/orders"]}>
          <CashierLayout title="Orders">Orders content</CashierLayout>
          <CurrentPath />
        </MemoryRouter>
      </Provider>,
    );

    expect(document.title).toBe("Orders");
    expect(screen.getByText("Orders content")).toBeTruthy();
    expect(screen.getByTestId("current-path").textContent).toBe(
      "/cashier/orders",
    );

    fireEvent.click(screen.getByRole("link", { name: "Transactions" }));
    expect(screen.getByTestId("current-path").textContent).toBe(
      "/cashier/transactions",
    );
  });
});
