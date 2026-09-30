import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CustomerDesktopOrderingPage from "./desktop-ordering-page";

vi.mock("../components/customer-sidebar", () => ({
  default: () => <div>customer sidebar</div>,
}));
vi.mock("./desktop-menu-panel", () => ({
  default: () => <div>customer menu panel</div>,
}));
vi.mock("../components/desktop-banner", () => ({
  default: () => <div>customer banner</div>,
}));
vi.mock("./cart/desktop-content", () => ({
  default: () => <div>customer cart panel</div>,
}));
vi.mock("../../../assets/icons", () => ({
  default: { laptopPlatter: "platter.png", laptopCart: "cart.png" },
}));

describe("CustomerDesktopOrderingPage", () => {
  it("composes sidebar, menu, banner, and cart panels in the laptop grid", () => {
    render(<CustomerDesktopOrderingPage />);

    expect(screen.getByText("customer sidebar")).toBeDefined();
    expect(screen.getByText("customer banner")).toBeDefined();
    expect(screen.getByText("customer menu panel")).toBeDefined();
    expect(screen.getByText("customer cart panel")).toBeDefined();
    expect(screen.getByRole("button", { name: "Lihat pesanan" })).toBeDefined();
    expect(
      screen.getByRole("button", { name: "Lihat keranjang" }),
    ).toBeDefined();
  });
});
