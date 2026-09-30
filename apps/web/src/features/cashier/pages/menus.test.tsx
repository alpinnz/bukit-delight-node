import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CashierMenusPage from "./menus";

vi.mock("../../../components/templates/cashier/layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <main>{children}</main>
  ),
}));

describe("CashierMenusPage", () => {
  it("renders the menu page content", () => {
    render(<CashierMenusPage />);
    expect(screen.getByText("Menus")).toBeDefined();
  });
});
