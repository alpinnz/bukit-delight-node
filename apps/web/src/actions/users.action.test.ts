import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UsersAction, { LOADING } from "./users.action";

vi.mock("axios", () => ({ default: vi.fn() }));

describe("UsersAction", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("creates an account with staff credentials and required account fields", async () => {
    const account = {
      access_token: "owner-access",
      refresh_token: "owner-refresh",
    };
    localStorage.setItem("account", JSON.stringify(account));
    vi.mocked(axios).mockResolvedValue({
      data: { name: "success", data: {} },
    } as never);
    const dispatch = vi.fn();

    await UsersAction.onCreate({
      username: "cashier",
      email: "cashier@example.test",
      role_ids: ["role-1", "role-2"],
      password: "secret",
      repeat_password: "secret",
    })(dispatch as never, (() => ({})) as never, undefined);

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: "api/v1/users",
        headers: expect.objectContaining({
          "x-access-token": account.access_token,
          "x-refresh-token": account.refresh_token,
        }),
      }),
    );
    const request = vi.mocked(axios).mock.calls[0][0] as unknown as {
      data: FormData;
    };
    expect(request.data.get("username")).toBe("cashier");
    expect(request.data.get("email")).toBe("cashier@example.test");
    expect(request.data.get("role_ids")).toBe("role-1,role-2");
    expect(request.data.get("password")).toBe("secret");
    await vi.waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({ type: LOADING, payload: false });
    });
  });

  it("updates account details without sending empty password fields", async () => {
    vi.mocked(axios).mockResolvedValue({
      data: { name: "success", data: {} },
    } as never);
    const dispatch = vi.fn();

    await UsersAction.onUpdate("account-1", {
      username: "cashier",
      email: "cashier@example.test",
      role_ids: ["role-1"],
    })(dispatch as never, (() => ({})) as never, undefined);

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "PUT",
        url: "api/v1/users/account-1",
      }),
    );
    const request = vi.mocked(axios).mock.calls[0][0] as unknown as {
      data: FormData;
    };
    expect(request.data.get("role_ids")).toBe("role-1");
    expect(request.data.get("password")).toBeNull();
    expect(request.data.get("repeat_password")).toBeNull();
  });
});
