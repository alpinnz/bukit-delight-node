import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import OrderInvoiceOverview from "./order-invoice-overview";

vi.mock("../../../helpers/formatters", () => ({
  default: {
    formatIndonesianDateTime: () => "26/9/2026 10:00 am",
    formatRupiah: (amount: number) => `Rp ${amount}`,
  },
}));

describe("OrderInvoiceOverview", () => {
  afterEach(cleanup);

  it("shows order details, promotion totals, cashier, and zero change", () => {
    render(
      <OrderInvoiceOverview
        data={{
          id: "order-1",
          created_at: "2026-09-26T10:00:00Z",
          table_id: { name: "A3" },
          customer_id: { username: "Nina" },
          quality: 2,
          promo: 5000,
          price: 25000,
          total_price: 20000,
        }}
        account={{ username: "Rudi" }}
        status="done"
        no_transaction="tx-1"
        change={0}
      />,
    );

    expect(screen.getByText("26/9/2026 10:00 am")).toBeDefined();
    expect(screen.getByText("order-1")).toBeDefined();
    expect(screen.getByText("A3")).toBeDefined();
    expect(screen.getByText("Nina")).toBeDefined();
    expect(screen.getByText("Rudi")).toBeDefined();
    expect(screen.getByText("tx-1")).toBeDefined();
    expect(screen.getByText("done")).toBeDefined();
    expect(screen.getByText("Rp 5000")).toBeDefined();
    expect(screen.getByText("Rp 25000")).toBeDefined();
    expect(screen.getByText("Rp 20000")).toBeDefined();
    expect(screen.getByText("Rp 0")).toBeDefined();
  });

  it("shows a total without promo or optional cashier/change rows", () => {
    render(
      <OrderInvoiceOverview
        data={{ id: "order-2", total_price: 12000, promo: 0 }}
      />,
    );

    expect(screen.getByText("order-2")).toBeDefined();
    expect(screen.getByText("Rp 12000")).toBeDefined();
    expect(screen.queryByText("Cashier")).toBeNull();
    expect(screen.queryByText("Kembalian")).toBeNull();
    expect(screen.queryByText("Promo")).toBeNull();
  });
});
