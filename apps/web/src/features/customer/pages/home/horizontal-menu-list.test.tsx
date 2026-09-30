import { fireEvent, render, screen } from "@testing-library/react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { describe, expect, it } from "vitest";
import RootReducer from "../../../../reducers";
import HorizontalMenuList from "./horizontal-menu-list";

describe("HorizontalMenuList", () => {
  it("opens the cart menu dialog with the selected menu", () => {
    const store = createStore(RootReducer);
    const menu = {
      id: "menu-id",
      name: "Iced Tea",
      title: "Iced Tea",
      image: "/iced-tea.jpg",
      price: 1500,
      promo: 0,
    };

    render(
      <Provider store={store}>
        <HorizontalMenuList title="Promo" data={[menu]} />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(store.getState().Cart.selected.menu.id).toBe("menu-id");
    expect(store.getState().Cart.dialog_menu.open).toBe(true);
  });
});
