import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import KasirHomePage from "./home";

vi.mock("../../../components/templates/kasir/container.base", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <main>{children}</main>
  ),
}));

describe("KasirHomePage", () => {
  it("renders the cashier home content", () => {
    render(<KasirHomePage />);
    expect(screen.getByText("home")).toBeDefined();
  });
});
