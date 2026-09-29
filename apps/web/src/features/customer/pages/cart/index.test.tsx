import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CustomerCartPage from "./index";

vi.mock("./mobile", () => ({ default: () => <div>mobile cart</div> }));

vi.mock("../laptop.page", () => ({
  default: () => <div>desktop cart</div>,
}));
vi.mock("./payment-dialog", () => ({
  default: () => <div>payment dialog</div>,
}));

describe("CustomerCartPage", () => {
  beforeEach(() => {
    document.title = "";
  });

  it("renders responsive variants and sets the page title", () => {
    render(<CustomerCartPage />);

    expect(screen.getByText("mobile cart")).toBeDefined();
    expect(screen.getByText("desktop cart")).toBeDefined();
    expect(screen.getByText("payment dialog")).toBeDefined();
    expect(document.title).toBe("Cart");
  });
});
