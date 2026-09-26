import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import RootReducer from "../../../../reducers";
import CustomerCategoryMenuPage from "./mobile";

vi.mock("../../../../components/common/container.customer.base", () => ({
  default: ({ children, title }: { children: ReactNode; title: string }) => (
    <div data-testid="category-title">
      {title}
      {children}
    </div>
  ),
}));

vi.mock("../../components/category-banner", () => ({
  default: () => <div>category banner</div>,
}));

vi.mock("../../components/menu-dialog", () => ({
  default: () => <div>menu dialog</div>,
}));

describe("CustomerCategoryMenuPage", () => {
  it("filters menus by route category and opens the selected item", () => {
    const store = createStore(RootReducer, {
      Menus: {
        mount: true,
        loading: false,
        data: [
          {
            _id: "tea-id",
            id_category: { _id: "drinks" },
            name: "Iced Tea",
            image: "/tea.jpg",
            price: 1200,
            promo: 200,
          },
          {
            _id: "cake-id",
            id_category: { _id: "desserts" },
            name: "Chocolate Cake",
            image: "/cake.jpg",
            price: 1800,
            promo: 0,
          },
        ],
      },
      Categories: {
        mount: true,
        loading: false,
        data: [{ _id: "drinks", name: "Drinks", image: "/drinks.jpg" }],
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/customer/book/drinks"]}>
          <Route path="/customer/book/:_id">
            <CustomerCategoryMenuPage />
          </Route>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByTestId("category-title").textContent).toContain(
      "Drinks",
    );
    expect(
      screen.getByRole("button", { name: "Pilih Iced Tea" }),
    ).toBeDefined();
    expect(
      screen.queryByRole("button", { name: "Pilih Chocolate Cake" }),
    ).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Pilih Iced Tea" }));
    expect(store.getState().Cart.selected.menu._id).toBe("tea-id");
  });
});
