import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CashierOrderPaymentDialog from "./payment-dialog";

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  state: {
    Orders: {
      dialog_payment: { open: true },
      order: { _id: "order-1", total_price: 32000 },
    },
  },
  hideDialogPayment: vi.fn(() => ({ type: "order/payment/hide" })),
  createTransaction: vi.fn((payload: { payment: string }) => ({
    type: "transaction/create",
    payload,
  })),
  notify: vi.fn((message: string) => ({ type: "service/notify", message })),
}));

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,
  useSelector: (selector: (state: typeof mocks.state) => unknown) =>
    selector(mocks.state),
}));
vi.mock("../../../../actions", () => ({
  default: {
    Orders: { hideDialogPayment: mocks.hideDialogPayment },
    Transactions: { onCreate: mocks.createTransaction },
    Service: { pushInfoNotification: mocks.notify },
  },
}));
vi.mock("../../../customer/components/invoice-overview", () => ({
  default: () => <div>Invoice summary</div>,
}));

describe("CashierOrderPaymentDialog", () => {
  afterEach(cleanup);
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.state.Orders.dialog_payment.open = true;
    mocks.state.Orders.order = { _id: "order-1", total_price: 32000 };
  });

  it("requires a cash amount before submitting", () => {
    render(<CashierOrderPaymentDialog />);
    fireEvent.click(screen.getByRole("button", { name: "Bayar" }));

    expect(mocks.notify).toHaveBeenCalledWith(
      "Pilih salah satu pembayaran tunai",
    );
    expect(mocks.createTransaction).not.toHaveBeenCalled();
  });

  it("rejects a cash amount below the order total", () => {
    mocks.state.Orders.order.total_price = 60000;
    render(<CashierOrderPaymentDialog />);
    fireEvent.click(screen.getByRole("button", { name: "50.000" }));
    fireEvent.click(screen.getByRole("button", { name: "Bayar" }));

    expect(mocks.notify).toHaveBeenCalledWith("Pilih kembalian yang sesuai");
    expect(mocks.createTransaction).not.toHaveBeenCalled();
  });

  it("creates a cash transaction when the selected amount covers the order", () => {
    render(<CashierOrderPaymentDialog />);
    fireEvent.click(screen.getByRole("button", { name: "50.000" }));
    fireEvent.click(screen.getByRole("button", { name: "Bayar" }));

    expect(mocks.createTransaction).toHaveBeenCalledWith({ payment: "cash" });
    expect(mocks.dispatch).toHaveBeenCalledWith({
      type: "transaction/create",
      payload: { payment: "cash" },
    });
  });
});
