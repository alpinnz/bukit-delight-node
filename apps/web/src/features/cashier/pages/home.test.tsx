import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CashierHomePage from "./home";

vi.mock("../../../components/templates/cashier/container.base", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <main>{children}</main>
  ),
}));

describe("CashierHomePage", () => {
  it("renders the cashier home content", () => {
    render(<CashierHomePage />);
    expect(screen.getByText("home")).toBeDefined();
  });
});
