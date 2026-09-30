import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Actions from "../../../../actions";
import CustomerCartItemList from "./cart-item-list";

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

const dispatch = vi.fn();
const menu = { name: "Kopi Susu", promo: 2000 };

describe("CustomerCartItemList", () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useDispatch).mockReturnValue(dispatch);
    vi.mocked(useSelector).mockImplementation((selector) =>
      selector({
        Cart: {
          data: [
            {
              id: "cart-1",
              menu,
              quality: 2,
              note: "Less ice",
              total_promo: 4000,
              total_price: 16000,
            },
          ],
        },
      } as never),
    );
  });

  it("shows quantity, note, promotion, and total for each cart item", () => {
    render(<CustomerCartItemList />);

    expect(screen.getByText("Kopi Susu")).toBeDefined();
    expect(screen.getByText("2x")).toBeDefined();
    expect(screen.getByText("Less ice")).toBeDefined();
    expect(screen.getByText("Promo")).toBeDefined();
    expect(screen.getByText("16.000")).toBeDefined();
  });

  it("selects the item and opens the edit dialog", () => {
    render(<CustomerCartItemList />);

    fireEvent.click(screen.getByRole("button", { name: "Edit Kopi Susu" }));

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      Actions.Cart.selectedEdit(menu, "cart-1", 2, "Less ice"),
    );
    expect(dispatch).toHaveBeenNthCalledWith(2, Actions.Cart.dialogMenuOpen());
  });
});
