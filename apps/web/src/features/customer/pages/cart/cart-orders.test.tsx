import { fireEvent, render, screen } from "@testing-library/react";
import { useDispatch } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Actions from "../../../../actions";
import CustomerCartOrders from "./cart-orders";

vi.mock("react-redux", () => ({ useDispatch: vi.fn() }));
vi.mock("../../components/menu-dialog", () => ({
  default: () => <div>menu dialog</div>,
}));
vi.mock("./payment-dialog", () => ({
  default: () => <div>payment dialog</div>,
}));
vi.mock("./recipe", () => ({
  default: () => <div>recipe</div>,
}));
vi.mock("./cart-item-list", () => ({
  default: () => <div>cart item list</div>,
}));

describe("CustomerCartOrders", () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useDispatch).mockReturnValue(dispatch);
  });

  it("renders order summary controls and opens the payment dialog", () => {
    render(<CustomerCartOrders />);

    expect(screen.getByText("cart item list")).toBeDefined();
    expect(screen.getByText("recipe")).toBeDefined();
    expect(screen.getByText("payment dialog")).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "Pesan" }));

    expect(dispatch).toHaveBeenCalledWith(Actions.Cart.dialogPaymentOpen());
  });
});
