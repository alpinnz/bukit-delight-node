import { render, screen } from "@testing-library/react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import RootReducer from "../../../reducers";
import LandingPage from "./index";

describe("LandingPage", () => {
  it("renders onboarding with links to login and registration", () => {
    render(
      <Provider store={createStore(RootReducer)}>
        <MemoryRouter>
          <LandingPage />
        </MemoryRouter>
      </Provider>,
    );

    expect(
      screen.getByRole("heading", { name: "Selamat Datang di Bukit Delight" }),
    ).toBeDefined();
    expect(screen.getByRole("link", { name: "Daftar" }).getAttribute("href"))
      .toBe("/register");
    expect(
      screen.getByRole("link", { name: "Mulai Menggunakan" }).getAttribute("href"),
    ).toBe("/login");
  });
});
