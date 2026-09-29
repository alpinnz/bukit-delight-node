import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CashierTransactionsPage from "./transactions";

vi.mock("../../../components/templates/cashier/container.base", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <main>{children}</main>
  ),
}));
vi.mock("./transactions/list-transactions", () => ({
  default: () => <div>transaction list</div>,
}));
vi.mock("./transactions/review-dialog", () => ({
  default: () => <div>review dialog</div>,
}));
vi.mock("./transactions/status-dialog", () => ({
  default: () => <div>status dialog</div>,
}));

describe("CashierTransactionsPage", () => {
  it("renders transactions and related dialogs", () => {
    render(<CashierTransactionsPage />);
    expect(screen.getByText("transaction list")).toBeDefined();
    expect(screen.getByText("review dialog")).toBeDefined();
    expect(screen.getByText("status dialog")).toBeDefined();
  });
});
