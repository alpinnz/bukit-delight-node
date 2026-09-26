import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import CustomerInvoiceOverview from "./invoice-overview";

vi.mock("../../../helpers/convert", () => ({
  default: {
    DateToTanggal: () => "26/9/2026 10:00 am",
    Rp: (amount: number) => `Rp ${amount}`,
  },
}));

describe("CustomerInvoiceOverview", () => {
  afterEach(cleanup);

  it("shows order details, promotion totals, cashier, and zero change", () => {
    render(
      <CustomerInvoiceOverview
        data={{
          _id: "order-1",
          createdAt: "2026-09-26T10:00:00Z",
          id_table: { name: "A3" },
          id_customer: { username: "Nina" },
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
      <CustomerInvoiceOverview
        data={{ _id: "order-2", total_price: 12000, promo: 0 }}
      />,
    );

    expect(screen.getByText("order-2")).toBeDefined();
    expect(screen.getByText("Rp 12000")).toBeDefined();
    expect(screen.queryByText("Kasir")).toBeNull();
    expect(screen.queryByText("Kembalian")).toBeNull();
    expect(screen.queryByText("Promo")).toBeNull();
  });
});
