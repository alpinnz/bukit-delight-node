import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CustomerCategoryList from "./category-list";

vi.mock("react-redux", () => ({ useSelector: vi.fn() }));

describe("CustomerCategoryList", () => {
  let categories: { id: string; name: string; image?: string }[] = [];

  beforeEach(() => {
    vi.clearAllMocks();
    categories = [
      { id: "drinks", name: "Minuman", image: "drinks.jpg" },
      { id: "food", name: "Makanan" },
    ];
    vi.mocked(useSelector).mockImplementation((selector) =>
      selector({ Categories: { data: categories } } as never),
    );
  });
  afterEach(cleanup);

  it("links every category and renders an image when one is available", () => {
    render(
      <MemoryRouter>
        <CustomerCategoryList />
      </MemoryRouter>,
    );

    expect(
      screen
        .getByRole("link", { name: "Pilih kategori Minuman" })
        .getAttribute("href"),
    ).toBe("/customer/book/drinks");
    expect(screen.getByRole("img", { name: "Minuman" })).toBeDefined();
    expect(
      screen.getByRole("link", { name: "Pilih kategori Makanan" }),
    ).toBeDefined();
    expect(screen.getByText("Makanan")).toBeDefined();
  });

  it("renders nothing when there are no categories", () => {
    categories = [];
    const { container } = render(
      <MemoryRouter>
        <CustomerCategoryList />
      </MemoryRouter>,
    );

    expect(container.textContent).toBe("");
  });
});
