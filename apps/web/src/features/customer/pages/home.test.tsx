import { fireEvent, render, screen } from "@testing-library/react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RootReducer from "../../../reducers";
import { SET_CUSTOMER } from "../../../actions/customers.action";
import { SET_TABLES } from "../../../actions/tables.action";
import CustomerHomePage from "./home";

vi.mock("./home/mobile", () => ({
  default: () => <div>Customer menu</div>,
}));
vi.mock("./laptop.page", () => ({
  default: () => <div>Customer desktop menu</div>,
}));

describe("CustomerHomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requires an authenticated customer to choose a table before ordering", () => {
    const store = createStore(RootReducer);
    store.dispatch({
      type: SET_CUSTOMER,
      payload: { _id: "customer-1", username: "customer@example.test" },
    });
    store.dispatch({
      type: SET_TABLES,
      payload: [{ _id: "table-1", name: "A1" }],
    });

    render(
      <Provider store={store}>
        <CustomerHomePage />
      </Provider>,
    );

    expect(screen.getByRole("heading", { name: "Pilih meja" })).toBeTruthy();
    fireEvent.change(screen.getByRole("combobox", { name: "Meja" }), {
      target: { value: "table-1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Lanjut ke menu" }));

    expect(store.getState().Tables.table).toEqual({
      _id: "table-1",
      name: "A1",
    });
    expect(screen.getByText("Customer menu")).toBeTruthy();
  });
});
