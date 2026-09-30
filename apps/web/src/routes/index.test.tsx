import { cleanup, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createStore } from "redux";
import { Provider } from "react-redux";
import AppRoutes from "./index";
import RootReducer from "../reducers";

vi.mock("./private.route", () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
vi.mock("../features/cashier/pages/orders", () => ({
  default: () => <div>Cashier orders destination</div>,
}));
vi.mock("../features/owner/pages/favorites", () => ({
  default: () => <div>Owner favorites destination</div>,
}));
vi.mock("../features/owner/pages/dashboard", () => ({
  default: () => <div>Owner dashboard destination</div>,
}));

const renderRoutesAt = (pathname: string) => {
  window.history.replaceState({}, "", pathname);
  return render(
    <Provider store={createStore(RootReducer)}>
      <AppRoutes />
    </Provider>,
  );
};

afterEach(() => {
  cleanup();
  window.history.replaceState({}, "", "/");
});

describe("canonical English routes", () => {
  it("renders the canonical cashier orders route", async () => {
    renderRoutesAt("/cashier/orders");

    expect(await screen.findByText("Cashier orders destination")).toBeDefined();
    await waitFor(() =>
      expect(window.location.pathname).toBe("/cashier/orders"),
    );
  });

  it("redirects an unknown owner route to the owner dashboard", async () => {
    renderRoutesAt("/owner/unknown");

    expect(
      await screen.findByText("Owner dashboard destination"),
    ).toBeDefined();
    await waitFor(() =>
      expect(window.location.pathname).toBe("/owner/dashboard"),
    );
  });
});
