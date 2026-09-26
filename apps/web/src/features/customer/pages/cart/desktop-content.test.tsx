import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Actions from "../../../../actions";
import CustomerDesktopCartContent from "./desktop-content";

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));
vi.mock("../../../../components/common/button.custom", () => ({
  default: ({
    label,
    onClick,
    disabled,
  }: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  }) => (
    <button disabled={disabled} onClick={onClick}>
      {label}
    </button>
  ),
}));
vi.mock("./overview", () => ({ default: () => <div>cart overview</div> }));
vi.mock("./desktop-cart-orders", () => ({
  default: () => <div>desktop cart orders</div>,
}));
vi.mock("./invoice-order", () => ({ default: () => <div>order invoice</div> }));
vi.mock("./invoice-transaction", () => ({
  default: () => <div>transaction invoice</div>,
}));

const createState = (cartChanges: Record<string, unknown> = {}) => ({
  Cart: {
    loading: false,
    selected: {
      bool: false,
      id_cart: null,
      quality: 0,
      note: "",
      menu: {},
    },
    order: null,
    transaction: null,
    data: [],
    ...cartChanges,
  },
  Tables: { table: { name: "A3" } },
  Transactions: { data: [] },
});

describe("CustomerDesktopCartContent", () => {
  const dispatch = vi.fn();
  let state = createState();

  beforeEach(() => {
    vi.clearAllMocks();
    state = createState();
    vi.mocked(useDispatch).mockReturnValue(dispatch);
    vi.mocked(useSelector).mockImplementation((selector) =>
      selector(state as never),
    );
  });
  afterEach(cleanup);

  it("shows the desktop menu edit panel and dispatches the updated note text", () => {
    state = createState({
      selected: {
        bool: true,
        id_cart: "cart-1",
        quality: 2,
        note: "Less ice",
        menu: { name: "Kopi Susu", price: 12000, promo: 1000 },
      },
    });

    render(<CustomerDesktopCartContent />);
    const noteInput = screen.getByRole("textbox", { name: "Catatan menu" });

    expect(screen.getByText("Kopi Susu")).toBeDefined();
    expect(noteInput).toHaveProperty("value", "Less ice");
    fireEvent.change(noteInput, { target: { value: "No sugar" } });

    expect(dispatch).toHaveBeenCalledWith(
      Actions.Cart.selectedChangeNote("No sugar"),
    );
  });

  it("creates the selected cart item and clears selection", () => {
    state = createState({
      selected: {
        bool: true,
        id_cart: null,
        quality: 2,
        note: "Less ice",
        menu: { name: "Kopi Susu", price: 12000 },
      },
    });

    render(<CustomerDesktopCartContent />);
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      Actions.Cart.onCreate({ name: "Kopi Susu", price: 12000 }, 2, "Less ice"),
    );
    expect(dispatch).toHaveBeenLastCalledWith(Actions.Cart.selectedClean());
  });

  it("keeps the loading state blank when no menu is selected", () => {
    state = createState({ loading: true });

    const { container } = render(<CustomerDesktopCartContent />);

    expect(container.textContent).toBe("");
  });

  it("shows the desktop cart overview and invoice branch", () => {
    state = createState({ order: { _id: "order-1" } });

    render(<CustomerDesktopCartContent />);

    expect(screen.getByText("cart overview")).toBeDefined();
    expect(screen.getByText("order invoice")).toBeDefined();
  });
});
