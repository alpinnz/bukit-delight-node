import { act, render, screen } from "@testing-library/react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { MemoryRouter, Route, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import RootReducer from "../../../../reducers";
import CustomerInitPage from "./index";

const LocationPath = () => {
  const location = useLocation();
  return <output>{location.pathname}</output>;
};

describe("CustomerInitPage", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("selects the scanned table and navigates to customer home", () => {
    vi.useFakeTimers();
    const table = { _id: "table-id", name: "A1" };
    const store = createStore(RootReducer, {
      Customers: {
        mount: true,
        loading: false,
        data: [],
        customer: { username: "Guest" },
      },
      Tables: { mount: true, loading: false, data: [table], table: null },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/customer/init/A1"]}>
          <Route path="/customer/init/:name_table">
            <CustomerInitPage />
          </Route>
          <LocationPath />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText("/customer/init/A1")).toBeDefined();
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText("/customer/home")).toBeDefined();
  });
});
