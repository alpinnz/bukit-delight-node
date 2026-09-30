import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CustomerMenuPage from "./index";

vi.mock("./mobile", () => ({
  default: () => <div>mobile menu</div>,
}));

vi.mock("../desktop-ordering-page", () => ({
  default: () => <div>desktop menu</div>,
}));

describe("CustomerMenuPage", () => {
  beforeEach(() => {
    document.title = "";
  });

  it("renders both responsive variants and sets the page title", () => {
    render(<CustomerMenuPage />);

    expect(screen.getByText("mobile menu")).toBeDefined();
    expect(screen.getByText("desktop menu")).toBeDefined();
    expect(document.title).toBe("Menu");
  });
});
