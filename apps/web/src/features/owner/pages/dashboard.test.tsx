import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import OwnerDashboardPage from "./dashboard";

vi.mock("../../../components/templates/owner/layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <main>{children}</main>
  ),
}));

describe("OwnerDashboardPage", () => {
  it("renders dashboard content", () => {
    render(<OwnerDashboardPage />);
    expect(screen.getByText("DashboardPage")).toBeDefined();
  });
});
