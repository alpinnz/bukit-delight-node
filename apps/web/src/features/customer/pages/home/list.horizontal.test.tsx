import { fireEvent, render, screen } from "@testing-library/react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { describe, expect, it } from "vitest";
import RootReducer from "../../../../reducers";
import ListHorizontal from "./list.horizontal";

describe("ListHorizontal", () => {
  it("opens the cart menu dialog with the selected menu", () => {
    const store = createStore(RootReducer);
    const menu = {
      _id: "menu-id",
      name: "Iced Tea",
      title: "Iced Tea",
      image: "/iced-tea.jpg",
      price: 1500,
      promo: 0,
    };

    render(
      <Provider store={store}>
        <ListHorizontal title="Promo" data={[menu]} />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(store.getState().Cart.selected.menu._id).toBe("menu-id");
    expect(store.getState().Cart.dialog_menu.open).toBe(true);
  });
});
