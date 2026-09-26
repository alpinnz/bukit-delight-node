import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AccountsAction, { LOADING } from "./accounts.action";

vi.mock("axios", () => ({ default: vi.fn() }));

describe("AccountsAction", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("creates an account with staff credentials and required account fields", async () => {
    const account = {
      accessToken: "admin-access",
      refreshToken: "admin-refresh",
    };
    localStorage.setItem("account", JSON.stringify(account));
    vi.mocked(axios).mockResolvedValue({
      data: { name: "success", data: {} },
    } as never);
    const dispatch = vi.fn();

    await AccountsAction.onCreate({
      username: "cashier",
      email: "cashier@example.test",
      id_role: "role-1",
      password: "secret",
      repeat_password: "secret",
    })(dispatch as never, (() => ({})) as never, undefined);

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: "api/v1/accounts/",
        headers: expect.objectContaining({
          "x-access-token": account.accessToken,
          "x-refresh-token": account.refreshToken,
        }),
      }),
    );
    const request = vi.mocked(axios).mock.calls[0][0] as unknown as {
      data: FormData;
    };
    expect(request.data.get("username")).toBe("cashier");
    expect(request.data.get("email")).toBe("cashier@example.test");
    expect(request.data.get("id_role")).toBe("role-1");
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

    await AccountsAction.onUpdate("account-1", {
      username: "cashier",
      email: "cashier@example.test",
      id_role: "role-1",
    })(dispatch as never, (() => ({})) as never, undefined);

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "PUT",
        url: "api/v1/accounts/account-1",
      }),
    );
    const request = vi.mocked(axios).mock.calls[0][0] as unknown as {
      data: FormData;
    };
    expect(request.data.get("id_role")).toBe("role-1");
    expect(request.data.get("password")).toBeNull();
    expect(request.data.get("repeat_password")).toBeNull();
  });
});
