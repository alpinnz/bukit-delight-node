import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import TransactionTable from "./table";

const mocks = vi.hoisted(() => ({ reduxState: {} as Record<string, unknown> }));

vi.mock("react-redux", () => ({
  useSelector: (selector: (state: unknown) => unknown) =>
    selector(mocks.reduxState),
}));
vi.mock("../../../../components/common/table.custom", () => ({
  default: ({
    title,
    columns,
    rows,
    loading,
  }: {
    title: string;
    columns: Array<{ label: string }>;
    rows: Array<{ account_username: string }>;
    loading: boolean;
  }) => (
    <section>
      <h1>{title}</h1>
      <div>
        {columns.map(({ label }, index) => (
          <span key={`${label}-${index}`}>{label}</span>
        ))}
      </div>
      <div>{loading ? "loading" : rows.map((row) => row.account_username)}</div>
    </section>
  ),
}));

describe("TransactionTable", () => {
  afterEach(cleanup);
  beforeEach(() => {
    mocks.reduxState = {
      Transactions: {
        loading: false,
        data: [
          {
            _id: "transaction-1",
            account_username: "cashier",
            order_customer_username: "customer",
            order_table_name: "A1",
            order_quality: 2,
            order_promo: 0,
            order_price: 500,
            order_total_price: 1000,
            order_status: "Lunas",
            status: "Selesai",
            createdAt: "2026-09-26T09:00:00.000Z",
          },
        ],
      },
    };
  });

  it("renders transaction records and their admin columns", () => {
    render(<TransactionTable />);
    expect(screen.getByText("Transactions")).toBeDefined();
    expect(screen.getByText("cashier")).toBeDefined();
    expect(screen.getByText("Customer")).toBeDefined();
    expect(screen.getAllByText("Table")).toHaveLength(1);
    expect(screen.getByText("Total Price")).toBeDefined();
    expect(screen.getByText("Date")).toBeDefined();
  });

  it("renders no table until transaction data is available", () => {
    mocks.reduxState = { Transactions: { data: undefined, loading: true } };
    const { container } = render(<TransactionTable />);
    expect(container.textContent).toBe("");
  });
});
