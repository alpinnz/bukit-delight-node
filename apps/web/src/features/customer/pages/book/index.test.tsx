import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CustomerBookPage from "./index";

vi.mock("./mobile", () => ({ default: () => <div>mobile book</div> }));
vi.mock("../desktop-ordering-page", () => ({
  default: () => <div>laptop customer</div>,
}));

describe("CustomerBookPage", () => {
  beforeEach(() => {
    document.title = "";
  });

  it("renders responsive mobile and laptop variants and sets the page title", () => {
    render(<CustomerBookPage />);

    expect(screen.getByText("mobile book")).toBeDefined();
    expect(screen.getByText("laptop customer")).toBeDefined();
    expect(document.title).toBe("Book");
  });
});
