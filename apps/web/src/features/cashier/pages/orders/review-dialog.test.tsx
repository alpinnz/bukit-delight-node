import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CashierOrderReviewDialog from "./review-dialog";

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  state: {
    Orders: {
      dialog_review: { open: true },
      order: {
        id: "order-1",
        table_id: { name: "Table 1" },
        categories: [{ name: "Food", items: [] }],
      },
    },
  },
  hideDialogReview: vi.fn(() => ({ type: "order/review/hide" })),
  openDialogPayment: vi.fn(() => ({ type: "order/payment/open" })),
}));

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,
  useSelector: (selector: (state: typeof mocks.state) => unknown) =>
    selector(mocks.state),
}));
vi.mock("../../../../actions", () => ({
  default: {
    Orders: {
      hideDialogReview: mocks.hideDialogReview,
      openDialogPayment: mocks.openDialogPayment,
    },
  },
}));
vi.mock("../../../orders/components/order-invoice-overview", () => ({
  default: () => <div>Invoice summary</div>,
}));
vi.mock("../../../orders/components/order-category-accordion", () => ({
  default: () => <div>Order details</div>,
}));

describe("CashierOrderReviewDialog", () => {
  afterEach(cleanup);
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.state.Orders.dialog_review.open = true;
    mocks.state.Orders.order = {
      id: "order-1",
      table_id: { name: "Table 1" },
      categories: [{ name: "Food", items: [] }],
    };
  });

  it("shows the order summary and opens payment before closing review", () => {
    render(<CashierOrderReviewDialog />);

    expect(screen.getByText("Invoice summary")).toBeDefined();
    expect(screen.getByText("Order details")).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "Bayar" }));

    expect(mocks.openDialogPayment).toHaveBeenCalledOnce();
    expect(mocks.hideDialogReview).toHaveBeenCalledOnce();
    expect(mocks.dispatch.mock.calls).toEqual([
      [{ type: "order/payment/open" }],
      [{ type: "order/review/hide" }],
    ]);
  });

  it("closes review from the close button", () => {
    render(<CashierOrderReviewDialog />);
    fireEvent.click(screen.getByRole("button", { name: "Tutup review" }));

    expect(mocks.hideDialogReview).toHaveBeenCalledOnce();
    expect(mocks.openDialogPayment).not.toHaveBeenCalled();
  });
});
