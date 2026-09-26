import { describe, expect, it, vi } from "vitest";
import CartAction, { CREATE, LOADING, SET_DATA, UPDATE } from "./cart.action";

describe("CartAction", () => {
  it("rebuilds cart items from menu records before dispatching data", async () => {
    const dispatch = vi.fn();
    const menus = {
      data: [
        { _id: "menu-1", name: "Latte", price: 1200, promo: 200 },
        { _id: "menu-2", name: "Tea", price: 800 },
      ],
    };
    const cart = {
      data: [
        { _id: "cart-1", id_menu: "menu-1", quality: "2", note: "Less ice" },
        { _id: "cart-2", id_menu: "missing-menu", quality: 1 },
      ],
    };

    await CartAction.onMount()(
      dispatch as never,
      (() => ({ Menus: menus, Cart: cart })) as never,
      undefined,
    );

    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: LOADING,
      payload: true,
    });
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: SET_DATA,
      payload: [
        {
          _id: "cart-1",
          id_menu: "menu-1",
          menu: menus.data[0],
          quality: 2,
          note: "Less ice",
          promo: 200,
          total_promo: 400,
          total_price: 2000,
        },
      ],
    });
    expect(dispatch).toHaveBeenNthCalledWith(3, {
      type: LOADING,
      payload: false,
    });
  });

  it("creates and updates cart actions with stable payload shapes", () => {
    const menu = { _id: "menu-1", price: 1000 };
    expect(CartAction.onCreate(menu, 2, "warm")).toEqual({
      type: CREATE,
      payload: { menu, quality: 2, note: "warm" },
    });
    expect(CartAction.onUpdate(menu, "cart-1", 3, "hot")).toEqual({
      type: UPDATE,
      payload: { menu, _id: "cart-1", quality: 3, note: "hot" },
    });
  });
});
