import { fireEvent, render, screen } from "@testing-library/react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import RootReducer from "../../../reducers";
import LoginPage from "./login.page";

describe("LoginPage", () => {
  it("shows required field errors when submitted empty", async () => {
    render(
      <Provider store={createStore(RootReducer)}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Masuk" }));

    const validationMessages = await screen.findAllByText("Cannot be empty");
    expect(validationMessages).toHaveLength(2);
  });
});
