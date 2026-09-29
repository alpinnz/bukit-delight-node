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
vi.mock("../features/admin/pages/favorites", () => ({
  default: () => <div>Admin favorites destination</div>,
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
  it("redirects legacy cashier URLs to the matching English route", async () => {
    renderRoutesAt("/kasir/orders");

    expect(await screen.findByText("Cashier orders destination")).toBeDefined();
    await waitFor(() =>
      expect(window.location.pathname).toBe("/cashier/orders"),
    );
  });

  it("redirects the legacy admin order URL to favorites", async () => {
    renderRoutesAt("/admin/pemesanan");

    expect(
      await screen.findByText("Admin favorites destination"),
    ).toBeDefined();
    await waitFor(() =>
      expect(window.location.pathname).toBe("/admin/favorites"),
    );
  });
});
