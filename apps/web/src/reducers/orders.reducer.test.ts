import { describe, expect, it } from "vitest";
import {
  CLEAN_ORDER,
  DIALOG_PAYMENT_HIDE,
  DIALOG_PAYMENT_OPEN,
  DIALOG_REVIEW_HIDE,
  DIALOG_REVIEW_OPEN,
  LOADING,
  MOUNT,
  SET_ORDER,
  SET_ORDERS,
} from "../actions/orders.action";
import OrdersReducer from "./orders.reducer";

describe("OrdersReducer", () => {
  it("starts with empty orders and closed dialogs", () => {
    expect(OrdersReducer(undefined, { type: "@@init" })).toEqual({
      mount: false,
      loading: false,
      order: null,
      data: [],
      dialog_payment: { open: false },
      dialog_review: { open: false },
    });
  });

  it("tracks mount/loading and selected order transitions", () => {
    const mounted = OrdersReducer(undefined, { type: MOUNT });
    const loading = OrdersReducer(mounted, { type: LOADING, payload: true });
    expect(loading.loading).toBe(true);

    const order = { id: "order-1", status: "pending" };
    const selected = OrdersReducer(loading, {
      type: SET_ORDER,
      payload: order,
    });
    expect(selected).toMatchObject({ loading: false, order });
    expect(OrdersReducer(selected, { type: CLEAN_ORDER }).order).toBeNull();
  });

  it("adds display fields to copied API order records", () => {
    const order = {
      id: "order-1",
      customer_id: { username: "guest" },
      table_id: { name: "A1" },
    };
    const loaded = OrdersReducer(undefined, {
      type: SET_ORDERS,
      payload: [order],
    });

    expect(loaded.data).toEqual([
      { ...order, customer_username: "guest", table_name: "A1" },
    ]);
    expect(order).not.toHaveProperty("customer_username");
    expect(order).not.toHaveProperty("table_name");
  });

  it("opens and closes payment and review dialogs", () => {
    const paymentOpen = OrdersReducer(undefined, { type: DIALOG_PAYMENT_OPEN });
    const reviewOpen = OrdersReducer(paymentOpen, { type: DIALOG_REVIEW_OPEN });
    expect(reviewOpen.dialog_payment.open).toBe(true);
    expect(reviewOpen.dialog_review.open).toBe(true);

    const dialogsClosed = OrdersReducer(
      OrdersReducer(reviewOpen, { type: DIALOG_PAYMENT_HIDE }),
      { type: DIALOG_REVIEW_HIDE },
    );
    expect(dialogsClosed.dialog_payment.open).toBe(false);
    expect(dialogsClosed.dialog_review.open).toBe(false);
  });
});
