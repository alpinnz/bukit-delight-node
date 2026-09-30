import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CashierTransactionReviewDialog from "./review-dialog";

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  state: {
    Transactions: {
      dialog_review: { open: true },
      transaction: {
        id: "transaction-1",
        status: "waiting",
        user_id: { username: "cashier" },
        order_id: {
          id: "order-1",
          categories: [{ name: "Food", items: [] }],
        },
      },
    },
  },
  hideDialogReview: vi.fn(() => ({ type: "transaction/review/hide" })),
  openDialogStatus: vi.fn(() => ({ type: "transaction/status/open" })),
}));

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,
  useSelector: (selector: (state: typeof mocks.state) => unknown) =>
    selector(mocks.state),
}));
vi.mock("../../../../actions", () => ({
  default: {
    Transactions: {
      hideDialogReview: mocks.hideDialogReview,
      openDialogStatus: mocks.openDialogStatus,
    },
  },
}));
vi.mock("../../../orders/components/order-invoice-overview", () => ({
  default: () => <div>Transaction summary</div>,
}));
vi.mock("../../../orders/components/order-category-accordion", () => ({
  default: () => <div>Transaction items</div>,
}));

describe("CashierTransactionReviewDialog", () => {
  afterEach(cleanup);
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.state.Transactions.dialog_review.open = true;
    mocks.state.Transactions.transaction = {
      id: "transaction-1",
      status: "waiting",
      user_id: { username: "cashier" },
      order_id: {
        id: "order-1",
        categories: [{ name: "Food", items: [] }],
      },
    };
  });

  it("shows transaction details and opens status update before closing review", () => {
    render(<CashierTransactionReviewDialog />);

    expect(screen.getByText("Transaction summary")).toBeDefined();
    expect(screen.getByText("Transaction items")).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "Update Status" }));

    expect(mocks.openDialogStatus).toHaveBeenCalledOnce();
    expect(mocks.hideDialogReview).toHaveBeenCalledOnce();
    expect(mocks.dispatch.mock.calls).toEqual([
      [{ type: "transaction/status/open" }],
      [{ type: "transaction/review/hide" }],
    ]);
  });

  it("closes transaction detail from the close button", () => {
    render(<CashierTransactionReviewDialog />);
    fireEvent.click(
      screen.getByRole("button", { name: "Tutup detail transaksi" }),
    );

    expect(mocks.hideDialogReview).toHaveBeenCalledOnce();
    expect(mocks.openDialogStatus).not.toHaveBeenCalled();
  });
});
