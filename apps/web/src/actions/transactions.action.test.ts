import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RootState } from "../reducers";
import TransactionsAction, { LOADING } from "./transactions.action";

vi.mock("axios", () => ({ default: vi.fn() }));

describe("TransactionsAction", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("creates a transaction with the active order, cashier, and payment", async () => {
    localStorage.setItem(
      "account",
      JSON.stringify({
        access_token: "staff-access",
        refresh_token: "staff-refresh",
      }),
    );
    vi.mocked(axios).mockResolvedValue({
      data: { name: "success", data: {} },
    } as never);
    const dispatch = vi.fn();
    const state = {
      Authentication: { account: { id: "account-1" } },
      Orders: { order: { id: "order-1" } },
    } as unknown as RootState;

    await TransactionsAction.onCreate({ payment: "cash", note: "paid" })(
      dispatch as never,
      (() => state) as never,
      undefined,
    );

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: "api/v1/transactions",
        headers: expect.objectContaining({
          "x-access-token": "staff-access",
          "x-refresh-token": "staff-refresh",
        }),
      }),
    );
    const createRequest = vi.mocked(axios).mock.calls[0][0] as unknown as {
      data: FormData;
    };
    expect(createRequest.data.get("order_id")).toBe("order-1");
    expect(createRequest.data.get("payment")).toBe("cash");
    expect(createRequest.data.get("note")).toBe("paid");
    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: LOADING,
      payload: true,
    });
    await vi.waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({
        type: LOADING,
        payload: false,
      });
    });
  });

  it("updates the selected transaction status at the status endpoint", async () => {
    localStorage.setItem(
      "account",
      JSON.stringify({ access_token: "staff-access", refresh_token: "refresh" }),
    );
    vi.mocked(axios).mockResolvedValue({
      data: { name: "success", data: {} },
    } as never);
    const dispatch = vi.fn();
    const state = {
      Transactions: { transaction: { id: "transaction-1" } },
    } as unknown as RootState;

    await TransactionsAction.onUpdateStatus({ status: "processing" })(
      dispatch as never,
      (() => state) as never,
      undefined,
    );

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "PATCH",
        url: "api/v1/transactions/transaction-1/status",
      }),
    );
    const updateRequest = vi.mocked(axios).mock.calls[0][0] as unknown as {
      data: FormData;
    };
    expect(updateRequest.data.get("status")).toBe("processing");
    await vi.waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({
        type: LOADING,
        payload: false,
      });
    });
  });
});
