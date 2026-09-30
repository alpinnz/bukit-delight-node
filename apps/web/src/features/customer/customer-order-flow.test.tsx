import { fireEvent, render, screen } from "@testing-library/react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { describe, expect, it, vi } from "vitest";
import RootReducer from "../../reducers";
import CustomerCartPage from "./pages/cart";
import CartOrders from "./pages/cart/cart-orders";
import MenuList from "./components/menu-list";

vi.mock("./pages/cart/mobile", () => ({ default: () => null }));
vi.mock("./pages/desktop-ordering-page", () => ({ default: () => null }));

describe("customer order flow", () => {
  it("selects a menu, adds it to cart, and opens payment choices", async () => {
    const store = createStore(RootReducer);
    const menu = {
      id: "iced-tea-id",
      name: "Iced Tea",
      image: "/iced-tea.jpg",
      price: 1500,
      promo: 200,
    };

    render(
      <Provider store={store}>
        <CustomerCartPage />
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

    expect(screen.queryByRole("dialog", { name: "Iced Tea" })).toBeNull();
    fireEvent.click(screen.getAllByRole("button", { name: "Pesan" })[0]);
    expect(screen.getByText("Pilih Metode Pembayaran")).toBeDefined();
    expect(screen.getByRole("button", { name: /Tunai/ })).toBeDefined();
  });
});
