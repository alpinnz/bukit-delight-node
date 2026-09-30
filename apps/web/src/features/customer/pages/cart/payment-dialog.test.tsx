import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CustomerPaymentDialog from "./payment-dialog";

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));
describe("CustomerPaymentDialog", () => {
  const dispatch = vi.fn();
  let isLoading = false;
  let isOpen = true;

  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    isLoading = false;
    isOpen = true;
    vi.mocked(useDispatch).mockReturnValue(dispatch);
    vi.mocked(useSelector).mockImplementation((selector) =>
      selector({
        Cart: { dialog_payment: { open: isOpen } },
        Orders: { loading: isLoading },
      } as never),
    );
  });

  it("shows payment choices and submits the cash order action", () => {
    render(<CustomerPaymentDialog />);

    expect(screen.getByRole("dialog")).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: /Tunai/ }));

    expect(dispatch).toHaveBeenCalledWith(expect.any(Function));
  });

  it("disables payment choices while an order request is loading", () => {
    isLoading = true;
    render(<CustomerPaymentDialog />);

    expect(screen.getByRole("button", { name: /Tunai/ })).toHaveProperty(
      "disabled",
      true,
    );
    expect(screen.getByRole("button", { name: /E-Money/ })).toHaveProperty(
      "disabled",
      true,
    );
  });

  it("does not render payment choices while closed", () => {
    isOpen = false;
    render(<CustomerPaymentDialog />);

    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
