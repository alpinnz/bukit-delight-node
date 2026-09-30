import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CashierOrdersPage from "./orders";

vi.mock("../../../components/templates/cashier/layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <main>{children}</main>
  ),
}));
vi.mock("./orders/list-orders", () => ({
  default: () => <div>order list</div>,
}));
vi.mock("./orders/payment-dialog", () => ({
  default: () => <div>payment dialog</div>,
}));
vi.mock("./orders/review-dialog", () => ({
  default: () => <div>review dialog</div>,
}));

describe("CashierOrdersPage", () => {
  it("renders order list and payment and review dialogs", () => {
    render(<CashierOrdersPage />);
    expect(screen.getByText("order list")).toBeDefined();
    expect(screen.getByText("payment dialog")).toBeDefined();
    expect(screen.getByText("review dialog")).toBeDefined();
  });
});
