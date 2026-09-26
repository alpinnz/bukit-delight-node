import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import KasirMenusPage from "./menus";

vi.mock("../../../components/templates/kasir/container.base", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <main>{children}</main>
  ),
}));

describe("KasirMenusPage", () => {
  it("renders the menu page content", () => {
    render(<KasirMenusPage />);
    expect(screen.getByText("Menus")).toBeDefined();
  });
});
