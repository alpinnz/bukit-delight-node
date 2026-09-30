import { fireEvent, render, screen } from "@testing-library/react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { describe, expect, it } from "vitest";
import RootReducer from "../../../reducers";
import MenuList from "./menu-list";

describe("MenuList", () => {
  it("selects a menu and opens the cart dialog", () => {
    const store = createStore(RootReducer);
    const menu = {
      id: "tea-id",
      name: "Iced Tea",
      image: "/iced-tea.jpg",
      price: 1200,
      promo: 200,
      favorite: 1,
    };

    render(
      <Provider store={store}>
        <MenuList data={[menu]} />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Pilih Iced Tea" }));

    expect(store.getState().Cart.selected.menu.id).toBe("tea-id");
    expect(store.getState().Cart.dialog_menu.open).toBe(true);
  });
});
