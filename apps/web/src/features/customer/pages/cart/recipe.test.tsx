import { render, screen } from "@testing-library/react";
import { useSelector } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CustomerCartRecipe from "./recipe";

vi.mock("react-redux", () => ({ useSelector: vi.fn() }));

const selectCartLines = (
  data: { total_promo?: number; total_price?: number }[],
) => {
  vi.mocked(useSelector).mockImplementation((selector) =>
    selector({ Cart: { data } } as never),
  );
};

describe("CustomerCartRecipe", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows the total without promotion details when no promotion applies", () => {
    selectCartLines([{ total_price: 120 }]);

    render(<CustomerCartRecipe />);

    expect(screen.getByText("Total")).toBeDefined();
    expect(screen.getByText("120")).toBeDefined();
    expect(screen.queryByText("Promo")).toBeNull();
  });

  it("shows the original price, promotion total, and discounted total", () => {
    selectCartLines([
      { total_promo: 15, total_price: 85 },
      { total_promo: 5, total_price: 45 },
    ]);

    render(<CustomerCartRecipe />);

    expect(screen.getByText("Harga Awal")).toBeDefined();
    expect(screen.getByText("20")).toBeDefined();
    expect(screen.getByText("150")).toBeDefined();
    expect(screen.getByText("130")).toBeDefined();
  });
});
