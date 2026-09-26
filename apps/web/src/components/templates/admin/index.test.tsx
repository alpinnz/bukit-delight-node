import { render, screen } from "@testing-library/react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import RootReducer from "../../../reducers";
import AdminTemplate from "./index";

describe("AdminTemplate", () => {
  it("sets the document title and renders page content and footer", () => {
    const store = createStore(RootReducer);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/admin/dashboard"]}>
          <AdminTemplate title="Dashboard">Dashboard content</AdminTemplate>
        </MemoryRouter>
      </Provider>,
    );

    expect(document.title).toBe("Dashboard");
    expect(screen.getByText("Dashboard content")).toBeTruthy();
    expect(screen.getByText("Alpinnz")).toBeTruthy();
  });
});
