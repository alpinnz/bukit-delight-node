import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter, useLocation } from "react-router-dom";
import ContainerCustomerBase from "./container.customer.base";

const CurrentPath = () => {
  const location = useLocation();
  return <span data-testid="current-path">{location.pathname}</span>;
};

afterEach(cleanup);

describe("ContainerCustomerBase", () => {
  it("renders the book banner and navigates through the customer bottom bar", () => {
    render(
      <MemoryRouter initialEntries={["/customer/book"]}>
        <ContainerCustomerBase type="book" navigationActive={1}>
          <main>Menu categories</main>
        </ContainerCustomerBase>
        <CurrentPath />
      </MemoryRouter>,
    );

    expect(screen.getByText("Menu categories")).toBeTruthy();
    expect(screen.getByAltText("banner-book")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Cart" }));
    expect(screen.getByTestId("current-path").textContent).toBe("/customer/cart");
  });

  it("renders the menu title and links back to the book route", () => {
    render(
      <MemoryRouter>
        <ContainerCustomerBase type="menu" title="Coffee" navigationActive={1}>
          <main>Menu items</main>
        </ContainerCustomerBase>
      </MemoryRouter>,
    );

    expect(screen.getByText("Coffee")).toBeTruthy();
    expect(screen.getByText("Menu items")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Back" }).getAttribute("href")).toBe(
      "/customer/book",
    );
  });
});
