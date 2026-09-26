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

  it("submits the active customer, table, cart items, and saved customer token", async () => {
    localStorage.setItem(
      "customer",
      JSON.stringify({ accessToken: "customer-access" }),
    );
    vi.mocked(axios).mockResolvedValue({
      data: { name: "success", data: {} },
    } as never);
    const dispatch = vi.fn();
    const state = {
      Customers: { customer: { _id: "customer-1" } },
      Tables: { table: { _id: "table-1" } },
      Cart: {
        data: [
          {
            _id: "cart-1",
            menu: { _id: "menu-1" },
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
    expect(formData.get("id_customer")).toBe("customer-1");
    expect(formData.get("id_table")).toBe("table-1");
    expect(formData.get("note")).toBe("Window seat");
    expect(formData.get("Menus[0][id_menu]")).toBe("menu-1");
    expect(formData.get("Menus[0][quality]")).toBe("2");
    expect(formData.get("Menus[0][note]")).toBe("Less ice");
    await vi.waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({
        type: LOADING,
        payload: false,
      });
    });
  });
});
