import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { describe, expect, it, vi } from "vitest";
import RootReducer from "../../../../reducers";
import CustomerMobileHome from "./mobile";

vi.mock("../../../../components/templates/customer/layout", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("./promotional-carousel", () => ({
  default: () => <div>promo slides</div>,
}));

vi.mock("./horizontal-menu-list", () => ({
  default: ({
    title,
    data,
  }: {
    title: string;
    data: Array<{ name: string }>;
  }) => <div>{`${title}: ${data.map((menu) => menu.name).join(", ")}`}</div>,
}));

vi.mock("../../components/menu-dialog", () => ({
  default: () => null,
}));

describe("CustomerMobileHome", () => {
  it("shows promoted and favorited menus in their respective lists", () => {
    const store = createStore(RootReducer, {
      Menus: {
        mount: true,
        loading: false,
        data: [
          { name: "Promo Tea", promo: 1000, favorite: false },
          { name: "Favorite Coffee", promo: 0, favorite: true },
          { name: "Regular Cake", promo: 0, favorite: false },
        ],
      },
    });

    render(
      <Provider store={store}>
        <CustomerMobileHome />
      </Provider>,
    );

    expect(screen.getByText("Promo: Promo Tea")).toBeDefined();
    expect(screen.getByText("Favorites: Favorite Coffee")).toBeDefined();
  });
});
