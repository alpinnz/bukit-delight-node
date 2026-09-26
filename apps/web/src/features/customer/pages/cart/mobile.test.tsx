import { render, screen } from "@testing-library/react";
import { useSelector } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CustomerCartMobilePage from "./mobile";

vi.mock("react-redux", () => ({ useSelector: vi.fn() }));
vi.mock("../../../../components/common/container.customer.base", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <main>{children}</main>
  ),
}));
vi.mock("./overview", () => ({
  default: () => <div>cart overview</div>,
}));
vi.mock("./cart-orders", () => ({
  default: () => <div>cart orders</div>,
}));
vi.mock("./invoice-order", () => ({
  default: () => <div>order invoice</div>,
}));
vi.mock("./invoice-transaction", () => ({
  default: () => <div>transaction invoice</div>,
}));

const selectCart = (cart: {
  order?: unknown;
  transaction?: unknown;
  data: unknown[];
}) => {
  vi.mocked(useSelector).mockImplementation((selector) =>
    selector({ Cart: cart } as never),
  );
};

describe("CustomerCartMobilePage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders the empty cart overview without order content", () => {
    selectCart({ data: [] });

    render(<CustomerCartMobilePage />);

    expect(screen.getByText("cart overview")).toBeDefined();
    expect(screen.queryByText("cart orders")).toBeNull();
  });

  it("renders cart items when no invoice is active", () => {
    selectCart({ data: [{ id: "menu-1" }] });

    render(<CustomerCartMobilePage />);

    expect(screen.getByText("cart orders")).toBeDefined();
  });

  it("prioritizes the order invoice over transaction and cart content", () => {
    selectCart({
      order: { id: "order-1" },
      transaction: { id: "tx-1" },
      data: [{}],
    });

    render(<CustomerCartMobilePage />);

    expect(screen.getByText("order invoice")).toBeDefined();
  });

  it("renders the transaction invoice when no order invoice is active", () => {
    selectCart({ transaction: { id: "tx-1" }, data: [{}] });

    render(<CustomerCartMobilePage />);

    expect(screen.getByText("transaction invoice")).toBeDefined();
  });
});
