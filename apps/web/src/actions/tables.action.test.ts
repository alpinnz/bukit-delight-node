import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TablesAction, { LOADING, SET_TABLES } from "./tables.action";

vi.mock("axios", () => ({ default: vi.fn() }));

describe("TablesAction.onLoad", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("loads table records with the saved staff credentials", async () => {
    const account = {
      access_token: "test-access-token",
      refresh_token: "test-refresh-token",
    };
    localStorage.setItem("account", JSON.stringify(account));
    const tables = [{ id: "table-1", name: "Terrace" }];
    vi.mocked(axios).mockResolvedValue({
      data: { name: "success", data: tables },
    } as never);
    const dispatch = vi.fn();

    await TablesAction.onLoad()(
      dispatch as never,
      (() => ({ Tables: { table: null, data: [] } })) as never,
      undefined,
    );

    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: LOADING,
      payload: true,
    });
    await vi.waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({
        type: SET_TABLES,
        payload: tables,
      });
    });
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: "api/v1/tables",
        headers: expect.objectContaining({
          "x-access-token": account.access_token,
          "x-refresh-token": account.refresh_token,
        }),
      }),
    );
  });
});

describe("TablesAction table write requests", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it.each([
    ["create", () => TablesAction.onCreate({ name: "Terrace" }), "Terrace"],
    [
      "update",
      () => TablesAction.onUpdate("table-1", { name: "Patio" }),
      "Patio",
    ],
  ])(
    "serializes the table name on %s",
    async (_operation, createAction, name) => {
      vi.mocked(axios).mockResolvedValue({
        data: { name: "success" },
      } as never);
      const dispatch = vi.fn();

      await createAction()(dispatch as never, (() => ({})) as never, undefined);

      const request = vi.mocked(axios).mock.calls[0][0] as unknown as {
        data: FormData;
      };
      expect(request.data.get("name")).toBe(name);
    },
  );
});
