import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import RootReducer from "../reducers";
import { SET_ACCOUNT } from "../features/auth/authentication.action";
import { SET_CUSTOMER } from "../actions/customers.action";
import CustomersRoute from "./customers.route";
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
        <Routes>{route}</Routes>
        <CurrentPath />
      </MemoryRouter>
    </Provider>,
  );

afterEach(cleanup);

describe("route guards", () => {
  it("redirects unauthenticated staff to login", () => {
    renderRoute(
      <Route
        path="/protected"
        element={
          <PrivateRoute role="owner">
            <div>Owner</div>
          </PrivateRoute>
        }
      />,
    );

    expect(screen.getByTestId("current-path").textContent).toBe("/login");
    expect(screen.queryByText("Owner")).toBeNull();
  });

  it("renders a page for the matching staff role", () => {
    const store = createStore(RootReducer);
    store.dispatch({ type: SET_ACCOUNT, payload: { role: "owner" } });
    renderRoute(
      <Route
        path="/protected"
        element={
          <PrivateRoute role="OWNER">
            <div>Owner</div>
          </PrivateRoute>
        }
      />,
      "/protected",
      store,
    );

    expect(screen.getByText("Owner")).toBeTruthy();
  });

  it("redirects unauthenticated customers to login", () => {
    renderRoute(
      <Route
        path="/protected"
        element={
          <CustomersRoute>
            <div>Customer</div>
          </CustomersRoute>
        }
      />,
    );

    expect(screen.getByTestId("current-path").textContent).toBe(
      "/login",
    );
  });

  it("requires a selected table before opening customer ordering routes", () => {
    const store = createStore(RootReducer);
    store.dispatch({
      type: SET_ACCOUNT,
      payload: {
        id: "account-1",
        role: "customer",
      },
    });
    store.dispatch({ type: SET_CUSTOMER, payload: { id: "account-1" } });
    renderRoute(
      <Route
        path="/protected"
        element={
          <CustomersRoute requireTable>
            <div>Customer</div>
          </CustomersRoute>
        }
      />,
      "/protected",
      store,
    );

    expect(screen.getByTestId("current-path").textContent).toBe(
      "/customer/home",
    );
    expect(screen.queryByText("Customer")).toBeNull();
  });

  it("renders the customer page after login without requiring a QR session", () => {
    const store = createStore(RootReducer);
    store.dispatch({
      type: SET_ACCOUNT,
      payload: {
        id: "account-1",
        role: "customer",
      },
    });
    store.dispatch({ type: SET_CUSTOMER, payload: { id: "account-1" } });
    renderRoute(
      <Route
        path="/protected"
        element={
          <CustomersRoute>
            <div>Customer</div>
          </CustomersRoute>
        }
      />,
      "/protected",
      store,
    );

    expect(screen.getByText("Customer")).toBeTruthy();
  });
});
