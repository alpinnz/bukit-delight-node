import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RolesAction, { LOADING, SET_ROLES } from "./roles.action";

vi.mock("axios", () => ({ default: vi.fn() }));

describe("RolesAction.onLoad", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("loads role records with the saved staff credentials", async () => {
    const account = {
      accessToken: "test-access-token",
      refreshToken: "test-refresh-token",
    };
    localStorage.setItem("account", JSON.stringify(account));
    const roles = [{ _id: "role-cashier", name: "cashier" }];
    vi.mocked(axios).mockResolvedValue({
      data: { name: "success", data: roles },
    } as never);
    const dispatch = vi.fn();

    await RolesAction.onLoad()(
      dispatch as never,
      (() => ({})) as never,
      undefined,
    );

    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: LOADING,
      payload: true,
    });
    await vi.waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({
        type: SET_ROLES,
        payload: roles,
      });
    });
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: "api/v1/roles/",
        headers: expect.objectContaining({
          "x-access-token": account.accessToken,
          "x-refresh-token": account.refreshToken,
        }),
      }),
    );
  });
});
