import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import CustomerAccordionListCategories from "./accordion-list-categories";

describe("CustomerAccordionListCategories", () => {
  afterEach(cleanup);

  it("renders item quantities, notes, promo prices, and totals", () => {
    render(
      <CustomerAccordionListCategories
        data={[
          {
            name: "Minuman",
            itemOrders: [
              {
                quality: 2,
                id_menu: { name: "Kopi Promo", price: 10000, promo: 2000 },
                promo: 4000,
                note: "Less ice",
                total_price: 16000,
              },
              {
                quality: 1,
                id_menu: { name: "Teh", price: 5000 },
                total_price: 5000,
              },
            ],
          },
        ]}
      />,
    );

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
    const { container } = render(<CustomerAccordionListCategories data={[]} />);

    expect(container.querySelector(".MuiAccordion-root")).toBeNull();
  });
});
