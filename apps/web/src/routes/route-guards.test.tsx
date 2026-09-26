import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { MemoryRouter, useLocation } from "react-router-dom";
import RootReducer from "../reducers";
import { SET_ACCOUNT } from "../features/auth/authentication.action";
import { SET_CUSTOMER } from "../actions/customers.action";
import { SET_TABLE } from "../actions/tables.action";
import CustomersRoute from "./costumers.route";
import PrivateRoute from "./private.route";

const CurrentPath = () => {
  const location = useLocation();
  return <span data-testid="current-path">{location.pathname}</span>;
};

const renderRoute = (
  route: ReactNode,
  initialPath = "/protected",
  store = createStore(RootReducer),
) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialPath]}>
        {route}
        <CurrentPath />
      </MemoryRouter>
    </Provider>,
  );

afterEach(cleanup);

describe("route guards", () => {
  it("redirects unauthenticated staff to login", () => {
    renderRoute(
      <PrivateRoute path="/protected" role="admin" component={() => <div>Admin</div>} />,
    );

    expect(screen.getByTestId("current-path").textContent).toBe("/login");
    expect(screen.queryByText("Admin")).toBeNull();
  });

  it("renders a page for the matching staff role", () => {
    const store = createStore(RootReducer);
    store.dispatch({ type: SET_ACCOUNT, payload: { role: "admin" } });
    renderRoute(
      <PrivateRoute path="/protected" role="ADMIN" component={() => <div>Admin</div>} />,
      "/protected",
      store,
    );

    expect(screen.getByText("Admin")).toBeTruthy();
  });

  it("requires both a customer and a selected table", () => {
    renderRoute(
      <CustomersRoute path="/protected" component={() => <div>Customer</div>} />,
    );

    expect(screen.getByTestId("current-path").textContent).toBe(
      "/customer/init/:_id_table",
    );
  });

  it("renders customer content after initialization", () => {
    const store = createStore(RootReducer);
    store.dispatch({ type: SET_CUSTOMER, payload: { _id: "customer-1" } });
    store.dispatch({ type: SET_TABLE, payload: { _id: "table-1", name: "Table 1" } });
    renderRoute(
      <CustomersRoute path="/protected" component={() => <div>Customer</div>} />,
      "/protected",
      store,
    );

    expect(screen.getByText("Customer")).toBeTruthy();
  });
});
