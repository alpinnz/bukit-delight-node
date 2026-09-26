import { cleanup, render, screen } from "@testing-library/react";
import { useSelector } from "react-redux";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CustomerOrderInvoice from "./invoice-order";
import CustomerTransactionInvoice from "./invoice-transaction";

vi.mock("react-redux", () => ({ useSelector: vi.fn() }));
vi.mock("../../components/invoice-overview", () => ({
  default: (props: {
    status?: string;
    no_transaction?: string;
    account?: { username: string };
    data: { _id: string };
  }) => (
    <div>
      {`invoice-${props.status}-${props.data._id}-${props.no_transaction ?? "none"}-${props.account?.username ?? "no-account"}`}
    </div>
  ),
}));
vi.mock("../../components/accordion-list-categories", () => ({
  default: ({ data }: { data: unknown[] }) => (
    <div>{`categories-${data.length}`}</div>
  ),
}));

describe("customer cart invoices", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(cleanup);

  it("passes the order and categories to the invoice components", () => {
    const order = {
      _id: "order-1",
      status: "pending",
      categories: [{ _id: "category-1" }],
    };
    vi.mocked(useSelector).mockReturnValueOnce(order);

    render(<CustomerOrderInvoice />);

    expect(
      screen.getByText("invoice-pending-order-1-none-no-account"),
    ).toBeDefined();
    expect(screen.getByText("categories-1")).toBeDefined();
  });

  it("passes transaction, order, cashier, and categories to the invoice components", () => {
    const transaction = {
      _id: "transaction-1",
      status: "done",
      id_account: { username: "cashier" },
      id_order: {
        _id: "order-2",
        categories: [{ _id: "category-1" }, { _id: "category-2" }],
      },
    };
    vi.mocked(useSelector).mockReturnValueOnce(transaction);

    render(<CustomerTransactionInvoice />);

    expect(
      screen.getByText("invoice-done-order-2-transaction-1-cashier"),
    ).toBeDefined();
    expect(screen.getByText("categories-2")).toBeDefined();
  });
});
