import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CashierTransactionList from "./list-transactions";

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  state: { Transactions: { data: [] as Array<Record<string, unknown>> } },
  setTransaction: vi.fn((transaction: unknown) => ({
    type: "transaction/set",
    transaction,
  })),
  openDialogReview: vi.fn(() => ({ type: "transaction/review/open" })),
}));

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,
  useSelector: (selector: (state: typeof mocks.state) => unknown) =>
    selector(mocks.state),
}));
vi.mock("../../../../actions", () => ({
  default: {
    Transactions: {
      setTransaction: mocks.setTransaction,
      openDialogReview: mocks.openDialogReview,
    },
  },
}));

const transaction = (
  id: string,
  table: string,
  createdAt: string,
  status = "waiting",
) => ({
  _id: id,
  status,
  createdAt,
  id_account: { username: "cashier" },
  id_order: {
    id_table: { name: table },
    id_customer: { username: `customer-${id}` },
  },
});

describe("CashierTransactionList", () => {
  afterEach(cleanup);
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.state.Transactions.data = [
      transaction("late", "Table 10", "2025-01-02T00:00:00.000Z"),
      transaction("early", "Table 2", "2025-01-01T00:00:00.000Z"),
      transaction("done", "Table 1", "2025-01-03T00:00:00.000Z", "done"),
    ];
  });

  it("shows active transactions in queue order and opens the selected detail", () => {
    render(<CashierTransactionList />);

    expect(screen.getByText("customer-early")).toBeDefined();
    expect(screen.getByText("customer-late")).toBeDefined();
    expect(screen.queryByText("customer-done")).toBeNull();
    fireEvent.click(
      screen.getByRole("button", { name: "Transaksi antrian 1" }),
    );

    expect(mocks.setTransaction).toHaveBeenCalledWith(
      expect.objectContaining({ _id: "early" }),
    );
    expect(mocks.openDialogReview).toHaveBeenCalledOnce();
    expect(mocks.dispatch).toHaveBeenCalledTimes(2);
  });

  it("sorts by table name without changing the Redux transaction order", () => {
    const reduxTransactions = mocks.state.Transactions.data;
    render(<CashierTransactionList />);

    fireEvent.click(
      screen.getByRole("button", { name: "Filter transactions" }),
    );
    fireEvent.click(screen.getByRole("menuitem", { name: "No Meja" }));

    const cards = screen.getAllByRole("button", { name: /Transaksi antrian/ });
    expect(cards[0].textContent).toContain("Table 2");
    expect(cards[1].textContent).toContain("Table 10");
    expect(reduxTransactions.map(({ _id }) => _id)).toEqual([
      "late",
      "early",
      "done",
    ]);
  });

  it("shows an empty state when every transaction is done", () => {
    mocks.state.Transactions.data = [
      transaction("done", "Table 1", "2025-01-03T00:00:00.000Z", "done"),
    ];
    render(<CashierTransactionList />);

    expect(screen.getByText("Tidak ada transaksi aktif.")).toBeDefined();
  });
});
