import { fireEvent, render, screen } from "@testing-library/react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import RootReducer from "../../../../reducers";
import CustomerInitForm from "./form";

describe("CustomerInitForm", () => {
  it("requires a username and table before creating a session", async () => {
    render(
      <Provider store={createStore(RootReducer)}>
        <MemoryRouter>
          <CustomerInitForm username table />
        </MemoryRouter>
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    const validationMessages = await screen.findAllByText("Cannot be empty");
    expect(validationMessages).toHaveLength(2);
  });
});
