import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CustomerHomePage from "./home";

vi.mock("./home/mobile", () => ({
  default: () => <div>mobile home</div>,
}));

vi.mock("./laptop.page", () => ({
  default: () => <div>desktop home</div>,
}));

describe("CustomerHomePage", () => {
  beforeEach(() => {
    document.title = "";
  });

  it("renders the responsive home layouts and sets the page title", () => {
    render(<CustomerHomePage />);

    expect(screen.getByText("mobile home")).toBeDefined();
    expect(screen.getByText("desktop home")).toBeDefined();
    expect(document.title).toBe("Home");
  });
});
