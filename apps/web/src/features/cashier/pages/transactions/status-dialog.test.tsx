import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CashierTransactionStatusDialog from "./status-dialog";

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  state: {
    Transactions: {
      dialog_status: { open: true },
      transaction: {
        status: "processing" as "pending" | "processing" | "done",
      },
    },
  },
  openDialogReview: vi.fn(() => ({ type: "transaction/review/open" })),
  hideDialogStatus: vi.fn(() => ({ type: "transaction/status/hide" })),
  updateStatus: vi.fn((payload: { status: string }) => ({
    type: "transaction/status/update",
    payload,
  })),
}));

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,
  useSelector: (selector: (state: typeof mocks.state) => unknown) =>
    selector(mocks.state),
}));
vi.mock("../../../../actions", () => ({
  default: {
    Transactions: {
      openDialogReview: mocks.openDialogReview,
      hideDialogStatus: mocks.hideDialogStatus,
      onUpdateStatus: mocks.updateStatus,
    },
  },
}));
vi.mock("./timeline", () => ({
  default: () => <div>Transaction timeline</div>,
}));

describe("CashierTransactionStatusDialog", () => {
  afterEach(cleanup);
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.state.Transactions.dialog_status.open = true;
    mocks.state.Transactions.transaction.status = "processing";
  });

  it("updates the status selected from the allowed transitions", () => {
    render(<CashierTransactionStatusDialog />);

    expect(screen.getByText("Transaction timeline")).toBeDefined();
    expect(screen.getByLabelText("Pending").hasAttribute("disabled")).toBe(
      true,
    );
    fireEvent.click(screen.getByLabelText("Done"));
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(mocks.updateStatus).toHaveBeenCalledWith({ status: "done" });
    expect(mocks.dispatch).toHaveBeenCalledWith({
      type: "transaction/status/update",
      payload: { status: "done" },
    });
  });

  it("returns to transaction review when closed", () => {
    render(<CashierTransactionStatusDialog />);
    fireEvent.click(
      screen.getByRole("button", { name: "Tutup pembaruan status" }),
    );

    expect(mocks.openDialogReview).toHaveBeenCalledOnce();
    expect(mocks.hideDialogStatus).toHaveBeenCalledOnce();
    expect(mocks.dispatch.mock.calls).toEqual([
      [{ type: "transaction/review/open" }],
      [{ type: "transaction/status/hide" }],
    ]);
  });
});
