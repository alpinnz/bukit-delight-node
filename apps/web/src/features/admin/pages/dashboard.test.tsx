import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AdminDashboardPage from "./dashboard";

vi.mock("../../../components/templates/admin", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <main>{children}</main>
  ),
}));

describe("AdminDashboardPage", () => {
  it("renders dashboard content", () => {
    render(<AdminDashboardPage />);
    expect(screen.getByText("DashboardPage")).toBeDefined();
  });
});
