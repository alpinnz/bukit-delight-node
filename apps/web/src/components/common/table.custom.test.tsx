import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { afterEach, describe, expect, it } from "vitest";
import RootReducer from "../../reducers";
import TableCustom from "./table.custom";

type MenuRow = { _id: string; name: string; price: number };
const rows: MenuRow[] = [
  { _id: "menu-1", name: "Coffee", price: 0 },
  { _id: "menu-2", name: "Tea", price: 1200 },
];

afterEach(cleanup);
const columns = [
  { id: "name", label: "Name" },
  {
    id: "price",
    label: "Price",
    cell: (row: MenuRow) => <span>{`Rp ${row.price}`}</span>,
  },
];

describe("TableCustom", () => {
  it("renders table rows, custom cells, and zero values", () => {
    const store = createStore(RootReducer);
    render(
      <Provider store={store}>
        <TableCustom title="Menus" rows={rows} columns={columns} />
      </Provider>,
    );

    expect(screen.getByRole("table", { name: "Menus" })).toBeTruthy();
    expect(screen.getByText("Coffee")).toBeTruthy();
    expect(screen.getByText("Rp 0")).toBeTruthy();
    expect(screen.getByText("Rp 1200")).toBeTruthy();
  });

  it("filters rows from the first column without case sensitivity", () => {
    const store = createStore(RootReducer);
    render(
      <Provider store={store}>
        <TableCustom title="Menus" rows={rows} columns={columns} />
      </Provider>,
    );

    fireEvent.change(screen.getAllByPlaceholderText("Search")[0], {
      target: { value: "tea" },
    });

    expect(screen.getByText("Tea")).toBeTruthy();
    expect(screen.queryByText("Coffee")).toBeNull();
  });

  it("opens the selected row in the update dialog", () => {
    const store = createStore(RootReducer);
    render(
      <Provider store={store}>
        <TableCustom
          title="Menus"
          rows={[rows[0]]}
          columns={columns}
          update
          remove
        />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Row actions" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Update" }));

    expect(store.getState().Service.form_dialog).toMatchObject({
      open: true,
      type: "update",
      row: rows[0],
    });
  });
});
