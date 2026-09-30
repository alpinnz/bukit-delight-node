import { fireEvent, render, screen } from "@testing-library/react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { describe, expect, it } from "vitest";
import Actions from "../../../actions";
import RootReducer from "../../../reducers";
import MenuDialog from "./menu-dialog";

describe("MenuDialog", () => {
  it("adds the selected menu and note to the cart", () => {
    const store = createStore(RootReducer);
    const menu = {
      id: "menu-id",
      name: "Iced Tea",
      image: "/iced-tea.jpg",
      price: 1500,
      promo: 0,
    };
    store.dispatch(Actions.Cart.selectedAdd(menu));
    store.dispatch(Actions.Cart.dialogMenuOpen());

    render(
      <Provider store={store}>
        <MenuDialog />
      </Provider>,
    );

    fireEvent.change(
      screen.getByPlaceholderText("Klik untuk menambahkan catatan"),
      {
        target: { value: "less sugar" },
      },
    );
    fireEvent.click(screen.getByRole("button", { name: "Tambah jumlah" }));
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    const cart = store.getState().Cart;
    expect(cart.data).toHaveLength(1);
    expect(cart.data[0]).toMatchObject({
      menu,
      note: "less sugar",
      quality: 1,
      total_price: 1500,
    });
    expect(cart.dialog_menu.open).toBe(false);
  });
});
