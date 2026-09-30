import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CashierOrderList from "./list-orders";

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  reduxState: {} as Record<string, unknown>,
  setOrder: vi.fn((order) => ({ type: "order/set", order })),
  openDialogReview: vi.fn(() => ({ type: "order/review/open" })),
}));

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,
  useSelector: (selector: (state: unknown) => unknown) =>
    selector(mocks.reduxState),
}));
vi.mock("../../../../actions", () => ({
  default: {
    Orders: {
      setOrder: mocks.setOrder,
      openDialogReview: mocks.openDialogReview,
    },
  },
}));

const pendingOrder = (
  id: string,
  tableName: string,
  status = "pending",
  is_expired = false,
) => ({
  id: id,
  status,
  is_expired,
  table_name: tableName,
  table_id: { name: tableName },
  customer_id: { username: `customer-${id}` },
  note: `note-${id}`,
});

describe("CashierOrderList", () => {
  afterEach(cleanup);
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.reduxState = {
      Orders: {
        data: [
          pendingOrder("order-z", "Table Z"),
          pendingOrder("order-a", "Table A"),
          pendingOrder("order-expired", "Table B", "pending", true),
          pendingOrder("order-paid", "Table C", "paid"),
        ],
      },
    };
  });

  it("shows only active pending orders and opens review when selected", () => {
    render(<CashierOrderList />);
    expect(screen.getByText("Table Z")).toBeDefined();
    expect(screen.getByText("Table A")).toBeDefined();
    expect(screen.queryByText("Table B")).toBeNull();
    expect(screen.queryByText("Table C")).toBeNull();

    fireEvent.click(screen.getByText("Table A"));
    expect(mocks.setOrder).toHaveBeenCalledWith(
      expect.objectContaining({ id: "order-a" }),
    );
    expect(mocks.openDialogReview).toHaveBeenCalledTimes(1);
    expect(mocks.dispatch).toHaveBeenCalledTimes(2);
  });

  it("sorts a copy by table name and leaves Redux order intact", () => {
    const reduxOrders = (
      mocks.reduxState as {
        Orders: { data: ReturnType<typeof pendingOrder>[] };
      }
    ).Orders.data;
    render(<CashierOrderList />);

    fireEvent.click(screen.getByRole("button", { name: "Filter orders" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "No Meja" }));

    const orderCards = screen
      .getAllByRole("button")
      .filter((button) => button.textContent?.includes("Customer"));
    expect(orderCards[0].textContent).toContain("Table A");
    expect(orderCards[1].textContent).toContain("Table Z");
    expect(reduxOrders.map(({ id }) => id)).toEqual([
      "order-z",
      "order-a",
      "order-expired",
      "order-paid",
    ]);
  });
});
