import { cleanup, render, screen } from "@testing-library/react";
import { useSelector } from "react-redux";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CustomerCartOverview from "./overview";

vi.mock("react-redux", () => ({ useSelector: vi.fn() }));
vi.mock("../../../../components/common/countdown.custom", () => ({
  default: ({ date }: { date?: string | number | Date }) => (
    <div>{`countdown-${date ?? "empty"}`}</div>
  ),
}));

const cartOverviewState = {
  Tables: { table: { name: "A3" } as { name: string } | null },
  Cart: {
    order: null as { expires: string } | null,
    transaction: null as {
      _id: string;
      status: string;
      id_order: { estimasi: string };
    } | null,
  },
  Transactions: {
    data: [] as {
      _id: string;
      status: string;
      createdAt: string;
      id_order: { estimasi: string };
    }[],
  },
};

describe("CustomerCartOverview", () => {
  const selectOverviewState = () => {
    vi.mocked(useSelector)
      .mockReturnValueOnce(cartOverviewState.Tables)
      .mockReturnValueOnce(cartOverviewState.Cart)
      .mockReturnValueOnce(cartOverviewState.Transactions.data);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    cartOverviewState.Tables.table = { name: "A3" };
    cartOverviewState.Cart.order = null;
    cartOverviewState.Cart.transaction = null;
    cartOverviewState.Transactions.data = [];
  });
  afterEach(cleanup);

  it("shows the default overview when the cart has no order", () => {
    selectOverviewState();
    render(<CustomerCartOverview />);

    expect(screen.getByText("Bukit Delight")).toBeDefined();
    expect(screen.getAllByText("- -")).toHaveLength(2);
    expect(screen.getByText("countdown-empty")).toBeDefined();
  });

  it("shows cashier instructions and the order expiry countdown", () => {
    cartOverviewState.Cart.order = { expires: "2026-10-01T12:00:00Z" };
    selectOverviewState();

    render(<CustomerCartOverview />);

    expect(screen.getByText("Selesaikan pembayaran dikasir")).toBeDefined();
    expect(screen.getByText("countdown-2026-10-01T12:00:00Z")).toBeDefined();
  });

  it("shows transaction status and queue position without mutating transaction order", () => {
    cartOverviewState.Cart.transaction = {
      _id: "tx-current",
      status: "pending",
      id_order: { estimasi: "2026-10-01T12:30:00Z" },
    };
    cartOverviewState.Transactions.data = [
      {
        _id: "tx-current",
        status: "pending",
        createdAt: "2026-09-26T10:00:00Z",
        id_order: { estimasi: "2026-10-01T12:30:00Z" },
      },
      {
        _id: "tx-first",
        status: "pending",
        createdAt: "2026-09-26T09:00:00Z",
        id_order: { estimasi: "2026-10-01T12:20:00Z" },
      },
      {
        _id: "tx-done",
        status: "done",
        createdAt: "2026-09-26T08:00:00Z",
        id_order: { estimasi: "2026-10-01T12:10:00Z" },
      },
    ];
    const originalOrder = cartOverviewState.Transactions.data.map(
      (item) => item._id,
    );
    selectOverviewState();

    render(<CustomerCartOverview />);

    expect(screen.getByText("Pesanan sedang antri")).toBeDefined();
    expect(screen.getByText("2")).toBeDefined();
    expect(cartOverviewState.Transactions.data.map((item) => item._id)).toEqual(
      originalOrder,
    );
  });
});
