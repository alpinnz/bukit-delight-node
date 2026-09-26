import { forwardRef, type ReactNode } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CustomerSidebar from "./sidebar";

vi.mock("react-redux", () => ({ useSelector: vi.fn() }));
vi.mock("react-router-dom", () => ({
  Link: forwardRef<HTMLAnchorElement, { to: string; children: ReactNode }>(
    ({ to, children }, ref) => (
      <a ref={ref} href={to}>
        {children}
      </a>
    ),
  ),
  useParams: vi.fn(),
}));
vi.mock("../../../components/common/loading.custom", () => ({
  default: () => <div>loading categories</div>,
}));

describe("CustomerSidebar", () => {
  let selectedCategoryId: string | undefined;
  let categoriesLoading = false;

  beforeEach(() => {
    vi.clearAllMocks();
    selectedCategoryId = "cat-1";
    categoriesLoading = false;
    window.history.pushState({}, "", "/customer/book/cat-1");
    vi.mocked(useParams).mockImplementation(
      () => ({ _id: selectedCategoryId }) as ReturnType<typeof useParams>,
    );
    vi.mocked(useSelector).mockImplementation((selector) =>
      selector({
        Categories: {
          loading: categoriesLoading,
          data: [
            { _id: "cat-1", name: "Minuman" },
            { _id: "cat-2", name: "Makanan" },
          ],
        },
      } as never),
    );
  });
  afterEach(() => {
    cleanup();
    window.history.pushState({}, "", "/");
  });

  it("renders category links and marks the current category selected", () => {
    render(<CustomerSidebar />);

    expect(screen.getByText("LOGO & TEKS BUKIT DELIGHT")).toBeDefined();
    expect(
      screen.getByRole("link", { name: "Minuman" }).getAttribute("href"),
    ).toBe("/customer/book/cat-1");
    expect(screen.getByRole("link", { name: "Makanan" })).toBeDefined();
    expect(screen.getByRole("link", { name: "PROMO & FAV." })).toBeDefined();
  });

  it("shows a loading state while categories load", () => {
    categoriesLoading = true;

    render(<CustomerSidebar />);

    expect(screen.getByText("loading categories")).toBeDefined();
  });

  it("links the home navigation item to the home route", () => {
    window.history.pushState({}, "", "/customer/home");
    selectedCategoryId = undefined;

    render(<CustomerSidebar />);

    expect(
      screen.getByRole("link", { name: "PROMO & FAV." }).getAttribute("href"),
    ).toBe("/customer/home");
  });
});
