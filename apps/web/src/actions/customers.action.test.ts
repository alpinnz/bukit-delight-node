import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CustomersAction, { LOADING, SET_CUSTOMER } from "./customers.action";

vi.mock("axios", () => ({ default: vi.fn() }));

describe("CustomersAction.onCreate", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("creates a customer with app credentials and persists the returned session", async () => {
    localStorage.setItem(
      "customer",
      JSON.stringify({ accessToken: "customer-token" }),
    );
    const customer = {
      _id: "customer-1",
      username: "guest",
      accessToken: "new-customer-token",
    };
    vi.mocked(axios).mockResolvedValue({
      data: { name: "success", data: customer },
    } as never);
    const dispatch = vi.fn();

    await CustomersAction.onCreate({ username: "guest" })(
      dispatch as never,
      (() => ({})) as never,
      undefined,
    );

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: "api/v1/customers",
        headers: expect.objectContaining({
          "x-access-token": "customer-token",
        }),
      }),
    );
    const request = vi.mocked(axios).mock.calls[0][0] as unknown as {
      data: FormData;
    };
    expect(request.data.get("username")).toBe("guest");

    await vi.waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({
        type: SET_CUSTOMER,
        payload: customer,
      });
      expect(dispatch).toHaveBeenCalledWith({ type: LOADING, payload: false });
    });
    expect(JSON.parse(localStorage.getItem("customer") ?? "null")).toEqual(
      customer,
    );
  });
});
