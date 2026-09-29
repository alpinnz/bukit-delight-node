import { fireEvent, render, screen } from "@testing-library/react";
import { useDispatch } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Actions from "../../../../actions";
import CustomerDesktopCartOrders from "./desktop-cart-orders";

vi.mock("react-redux", () => ({ useDispatch: vi.fn() }));
vi.mock("./cart-item-list", () => ({
  default: ({
    onEditItem,
  }: {
    onEditItem?: (item: {
      _id: string;
      menu: { name: string };
      quality: number;
      note: string;
    }) => void;
  }) => (
    <button
      onClick={() =>
        onEditItem?.({
          _id: "cart-1",
          menu: { name: "Kopi" },
          quality: 2,
          note: "Less ice",
        })
      }
    >
      Edit item
    </button>
  ),
}));
vi.mock("./recipe", () => ({ default: () => <div>cart recipe</div> }));
describe("CustomerDesktopCartOrders", () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useDispatch).mockReturnValue(dispatch);
  });

  it("edits the selected item and opens payment from the desktop cart", () => {
    render(<CustomerDesktopCartOrders />);

    expect(screen.getByText("cart recipe")).toBeDefined();
    expect(screen.queryByText("payment dialog")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Edit item" }));
    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      Actions.Cart.selectedEdit({ name: "Kopi" }, "cart-1", 2, "Less ice"),
    );
    fireEvent.click(screen.getByRole("button", { name: "Pesan" }));
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      Actions.Cart.dialogPaymentOpen(),
    );
  });
});
