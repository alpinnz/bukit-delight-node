import { describe, expect, it } from "vitest";
import {
  CLEAN_TRANSACTION,
  DIALOG_REVIEW_HIDE,
  DIALOG_REVIEW_OPEN,
  DIALOG_STATUS_HIDE,
  DIALOG_STATUS_OPEN,
  LOADING,
  MOUNT,
  SET_TRANSACTION,
  SET_TRANSACTIONS,
} from "../actions/transactions.action";
import TransactionsReducer from "./transactions.reducer";

describe("TransactionsReducer", () => {
  it("starts with no transactions and closed dialogs", () => {
    expect(TransactionsReducer(undefined, { type: "@@init" })).toEqual({
      mount: false,
      loading: false,
      transaction: null,
      data: [],
      dialog_review: { open: false },
      dialog_status: { open: false },
    });
  });

  it("sets mount/loading and selected transaction state", () => {
    const mounted = TransactionsReducer(undefined, { type: MOUNT });
    const loading = TransactionsReducer(mounted, {
      type: LOADING,
      payload: true,
    });
    expect(loading.loading).toBe(true);

    const transaction = { id: "transaction-1", status: "processing" };
    const selected = TransactionsReducer(loading, {
      type: SET_TRANSACTION,
      payload: transaction,
    });
    expect(selected).toMatchObject({ loading: false, transaction });
    expect(
      TransactionsReducer(selected, { type: CLEAN_TRANSACTION }).transaction,
    ).toBeNull();
  });

  it("flattens populated account/order fields onto copies", () => {
    const transaction = {
      id: "transaction-1",
      user_id: { id: "account-1", username: "cashier" },
      order_id: {
        customer_id: { id: "customer-1", username: "guest" },
        table_id: { id: "table-1", name: "A1" },
        quality: 2,
        promo: 100,
        price: 5000,
        total_price: 9900,
        status: "pending",
      },
    };
    const loaded = TransactionsReducer(undefined, {
      type: SET_TRANSACTIONS,
      payload: [transaction],
    });

    expect(loaded).toMatchObject({ mount: true, loading: false });
    expect(loaded.data[0]).toMatchObject({
      user_id: "account-1",
      user_username: "cashier",
      order_customer_id: "customer-1",
      order_customer_username: "guest",
      order_table_id: "table-1",
      order_table_name: "A1",
      order_quality: 2,
      order_promo: 100,
      order_price: 5000,
      order_total_price: 9900,
      order_status: "pending",
    });
    expect(transaction).not.toHaveProperty("user_id");
    expect(transaction.order_id).not.toHaveProperty("order_status");
  });

  it("opens and closes review and status dialogs", () => {
    const reviewOpen = TransactionsReducer(undefined, {
      type: DIALOG_REVIEW_OPEN,
    });
    const bothOpen = TransactionsReducer(reviewOpen, {
      type: DIALOG_STATUS_OPEN,
    });
    expect(bothOpen.dialog_review.open).toBe(true);
    expect(bothOpen.dialog_status.open).toBe(true);

    const bothClosed = TransactionsReducer(
      TransactionsReducer(bothOpen, { type: DIALOG_REVIEW_HIDE }),
      { type: DIALOG_STATUS_HIDE },
    );
    expect(bothClosed.dialog_review.open).toBe(false);
    expect(bothClosed.dialog_status.open).toBe(false);
  });
});
