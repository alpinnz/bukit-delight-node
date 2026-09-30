import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import OrderCategoryAccordion from "./order-category-accordion";

describe("OrderCategoryAccordion", () => {
  afterEach(cleanup);

  it("renders item quantities, notes, promo prices, and totals", () => {
    render(
      <OrderCategoryAccordion
        data={[
          {
            name: "Minuman",
            items: [
              {
                quality: 2,
                menu_id: { name: "Kopi Promo", price: 10000, promo: 2000 },
                promo: 4000,
                note: "Less ice",
                total_price: 16000,
              },
              {
                quality: 1,
                menu_id: { name: "Teh", price: 5000 },
                total_price: 5000,
              },
            ],
          },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Minuman" }));
    expect(screen.getByText("Minuman")).toBeDefined();
    expect(screen.getByText("Kopi Promo")).toBeDefined();
    expect(screen.getByText("Less ice")).toBeDefined();
    expect(screen.getByText("@Rp 8.000")).toBeDefined();
    expect(screen.getByText("@Rp 10.000")).toBeDefined();
    expect(screen.getByText("Rp 16.000")).toBeDefined();
    expect(screen.getByText("Teh")).toBeDefined();
    expect(screen.getByText("Rp 5.000")).toBeDefined();
  });

  it("renders no category rows for an empty category list", () => {
    const { container } = render(<OrderCategoryAccordion data={[]} />);

    expect(container.querySelector("section")).toBeNull();
  });
});
