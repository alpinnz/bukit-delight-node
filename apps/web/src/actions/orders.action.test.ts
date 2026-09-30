import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import OrdersAction, { LOADING } from "./orders.action";
import type { RootState } from "../reducers";

vi.mock("axios", () => ({ default: vi.fn() }));

describe("OrdersAction.onCreate", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("submits the authenticated customer, table, and cart items", async () => {
    localStorage.setItem(
      "account",
      JSON.stringify({ access_token: "customer-access", refresh_token: "refresh" }),
    );
    vi.mocked(axios).mockResolvedValue({
      data: { name: "success", data: {} },
    } as never);
    const dispatch = vi.fn();
    const state = {
      Customers: { customer: { id: "customer-1" } },
      Tables: { table: { id: "table-1" } },
      Cart: {
        data: [
          {
            id: "cart-1",
            menu: { id: "menu-1" },
            quality: 2,
            note: "Less ice",
          },
        ],
      },
    } as unknown as RootState;

    await OrdersAction.onCreate({ note: "Window seat" })(
      dispatch as never,
      (() => state) as never,
      undefined,
    );

    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: LOADING,
      payload: true,
    });
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: "api/v1/orders",
        headers: expect.objectContaining({
          "x-access-token": "customer-access",
        }),
      }),
    );
    const request = vi.mocked(axios).mock.calls[0][0] as unknown as {
      data: FormData;
    };
    const formData = request.data;
    expect(formData.get("customer_id")).toBe("customer-1");
    expect(formData.get("table_id")).toBe("table-1");
    expect(formData.get("note")).toBe("Window seat");
    expect(formData.get("items[0][menu_id]")).toBe("menu-1");
    expect(formData.get("items[0][quality]")).toBe("2");
    expect(formData.get("items[0][note]")).toBe("Less ice");
    await vi.waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({
        type: LOADING,
        payload: false,
      });
    });
  });
});
