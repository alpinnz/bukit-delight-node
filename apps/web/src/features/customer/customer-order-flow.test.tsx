import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { describe, expect, it } from "vitest";
import RootReducer from "../../reducers";
import CartOrders from "./pages/cart/cart-orders";
import MenuList from "./components/menu-list";

describe("customer order flow", () => {
  it("selects a menu, adds it to cart, and opens payment choices", async () => {
    const store = createStore(RootReducer);
    const menu = {
      _id: "iced-tea-id",
      name: "Iced Tea",
      image: "/iced-tea.jpg",
      price: 1500,
      promo: 200,
    };

    render(
      <Provider store={store}>
        <MenuList data={[menu]} />
        <CartOrders />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Pilih Iced Tea" }));
    fireEvent.change(
      screen.getByPlaceholderText("Klik untuk menambahkan catatan"),
      { target: { value: "less sugar" } },
    );
    fireEvent.click(screen.getByRole("button", { name: "Tambah jumlah" }));
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(screen.getByText("less sugar")).toBeDefined();
    expect(screen.getByText("1x")).toBeDefined();
    expect(screen.getByText("1.300")).toBeDefined();
    expect(store.getState().Cart.data).toHaveLength(1);

    await waitForElementToBeRemoved(() => screen.queryByRole("dialog"));
    fireEvent.click(screen.getByRole("button", { name: "Pesan" }));
    expect(screen.getByText("Pilih Metode Pembayaran")).toBeDefined();
    expect(screen.getByRole("button", { name: /Tunai/ })).toBeDefined();
  });
});
