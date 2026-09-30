import { describe, expect, it, vi } from "vitest";
import {
  CLEAN,
  CLEAN_ORDER,
  CLEAN_TRANSACTION,
  CREATE,
  DELETE,
  DIALOG_MENU_HIDE,
  DIALOG_MENU_OPEN,
  DIALOG_PAYMENT_HIDE,
  DIALOG_PAYMENT_OPEN,
  SELECTED_ADD,
  SELECTED_CHANGE_NOTE,
  SELECTED_CLEAN,
  SELECTED_DESCREMENT_QUALITY,
  SELECTED_EDIT,
  SELECTED_INCREMENT_QUALITY,
  SET_DATA,
  SET_ORDER,
  SET_TRANSACTION,
  UPDATE,
} from "../actions/cart.action";
import CartReducer from "./cart.reducer";

describe("CartReducer", () => {
  it("starts with an empty cart and closed dialogs", () => {
    expect(CartReducer(undefined, { type: "@@init" })).toEqual({
      loading: false,
      selected: { bool: false, menu: {}, id_cart: null, quality: 0, note: "" },
      order: null,
      transaction: null,
      dialog_menu: { open: false },
      dialog_payment: { open: false },
      data: [],
    });
  });

  it("creates cart items with quantity and promo totals", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(100));
    const state = CartReducer(undefined, {
      type: CREATE,
      payload: {
        menu: { id: "menu-1", price: 1200, promo: 200 },
        quality: 2,
        note: "Less ice",
      },
    });
    vi.useRealTimers();

    expect(state).toMatchObject({
      loading: false,
      data: [
        {
          id: "100",
          menu: { id: "menu-1" },
          quality: 2,
          note: "Less ice",
          total_promo: 400,
          total_price: 2000,
        },
      ],
    });
  });

  it("updates an item without mutating the prior cart and can delete it", () => {
    const item = {
      id: "cart-1",
      menu: { price: 1000, promo: 100 },
      quality: 1,
      note: "old",
      total_promo: 100,
      total_price: 900,
    };
    const previous = {
      ...CartReducer(undefined, { type: SET_DATA, payload: [item] }),
    };
    const updated = CartReducer(previous, {
      type: UPDATE,
      payload: {
        id: "cart-1",
        menu: { price: 2000, promo: 250 },
        quality: 3,
        note: "new",
      },
    });

    expect(previous.data[0]).toEqual(item);
    expect(updated.data[0]).toMatchObject({
      quality: 3,
      note: "new",
      total_promo: 750,
      total_price: 5250,
    });
    expect(
      CartReducer(updated, { type: DELETE, payload: "cart-1" }).data,
    ).toEqual([]);
  });

  it("tracks selected menu, quantity, note, and clears selection", () => {
    const added = CartReducer(undefined, {
      type: SELECTED_ADD,
      payload: { id: "menu-1", price: 1000 },
    });
    const edited = CartReducer(added, {
      type: SELECTED_EDIT,
      payload: {
        menu: { id: "menu-2" },
        id_cart: "cart-2",
        quality: 1,
        note: "warm",
      },
    });
    const incremented = CartReducer(edited, {
      type: SELECTED_INCREMENT_QUALITY,
    });
    expect(incremented.selected.quality).toBe(2);
    expect(
      CartReducer(incremented, { type: SELECTED_DESCREMENT_QUALITY }).selected
        .quality,
    ).toBe(1);
    const noted = CartReducer(incremented, {
      type: SELECTED_CHANGE_NOTE,
      payload: "extra hot",
    });
    expect(noted.selected.note).toBe("extra hot");
    const cleaned = CartReducer(noted, { type: SELECTED_CLEAN });
    expect(cleaned.selected).toEqual({
      bool: false,
      menu: {},
      id_cart: null,
      quality: 0,
      note: "",
    });
    expect(CartReducer(cleaned, { type: SELECTED_DESCREMENT_QUALITY })).toBe(
      cleaned,
    );
  });

  it("stores and clears order and transaction invoices", () => {
    const order = { id: "order-1" };
    const transaction = { id: "transaction-1" };
    const withOrder = CartReducer(undefined, {
      type: SET_ORDER,
      payload: order,
    });
    const withTransaction = CartReducer(withOrder, {
      type: SET_TRANSACTION,
      payload: transaction,
    });
    expect(withTransaction).toMatchObject({ order, transaction });
    expect(CartReducer(withTransaction, { type: CLEAN_ORDER })).toMatchObject({
      order: null,
      transaction,
    });
    expect(
      CartReducer(withTransaction, { type: CLEAN_TRANSACTION }),
    ).toMatchObject({ order, transaction: null });
  });

  it("opens and closes both dialogs, and clean resets cart data", () => {
    const opened = CartReducer(
      CartReducer(undefined, { type: DIALOG_MENU_OPEN }),
      { type: DIALOG_PAYMENT_OPEN },
    );
    expect(opened.dialog_menu.open).toBe(true);
    expect(opened.dialog_payment.open).toBe(true);
    const closed = CartReducer(
      CartReducer(opened, { type: DIALOG_MENU_HIDE }),
      { type: DIALOG_PAYMENT_HIDE },
    );
    expect(closed.dialog_menu.open).toBe(false);
    expect(closed.dialog_payment.open).toBe(false);

    const dirty = CartReducer(closed, {
      type: SET_DATA,
      payload: [{ id: "cart-1" }],
    });
    expect(CartReducer(dirty, { type: CLEAN })).toMatchObject({
      loading: false,
      data: [],
      dialog_cart: { open: false, id_cart: null, quality: 0, note: "" },
      dialog_payment: { open: false },
    });
  });
});
