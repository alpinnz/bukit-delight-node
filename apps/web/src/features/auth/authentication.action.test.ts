import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AuthenticationAction, { MOUNT } from "./authentication.action";

vi.mock("axios", () => ({
  default: Object.assign(vi.fn(), {
    isAxiosError: (cause: unknown) =>
      typeof cause === "object" && cause !== null && "isAxiosError" in cause,
  }),
}));

describe("AuthenticationAction.onMount", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("skips refresh when there is no saved account", async () => {
    const dispatch = vi.fn();

    await AuthenticationAction.onMount()(
      dispatch as never,
      (() => ({})) as never,
      undefined,
    );

    expect(axios).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith({ type: MOUNT });
  });

  it("restores customer profile from the user record", async () => {
    const account = {
      id: "account-1",
      username: "customer@example.test",
      email: "customer@example.test",
      role: "customer",
      access_token: "customer-access",
      refresh_token: "customer-refresh",
    };
    localStorage.setItem("account", JSON.stringify(account));
    vi.mocked(axios).mockResolvedValue({
      data: { name: "success", data: account },
    } as never);
    const dispatch = vi.fn();

    await AuthenticationAction.onMount()(
      dispatch as never,
      (() => ({})) as never,
      undefined,
    );

    expect(dispatch).toHaveBeenCalledWith({
      type: "CUSTOMERS/SET_CUSTOMER",
      payload: { id: "account-1", username: "customer@example.test" },
    });
    expect(JSON.parse(localStorage.getItem("account") ?? "null")).toEqual(
      account,
    );
  });
});

describe("AuthenticationAction.onLogin", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("recognizes the active session code in the API error envelope", async () => {
    vi.mocked(axios).mockRejectedValue(
      Object.assign(new Error("Conflict"), {
        isAxiosError: true,
        response: { data: { error: { code: "ACTIVE_SESSION" } } },
      }) as never,
    );
    const dispatch = vi.fn();

    const result = await AuthenticationAction.onLogin({
      username: "cashier",
      password: "password",
    })(dispatch as never, (() => ({})) as never, undefined);

    expect(result).toBe("active-session");
  });

  it("sets the linked customer profile when a customer signs in", async () => {
    vi.mocked(axios).mockResolvedValue({
      data: {
        name: "success",
        data: {
          id: "account-1",
          username: "customer@example.test",
          email: "customer@example.test",
          role: "customer",
          access_token: "customer-access",
          refresh_token: "customer-refresh",
        },
      },
    } as never);
    const dispatch = vi.fn();

    const result = await AuthenticationAction.onLogin({
      username: "customer@example.test",
      password: "Customer123!",
    })(dispatch as never, (() => ({})) as never, undefined);

    expect(result).toBe("success");
    expect(dispatch).toHaveBeenCalledWith({
      type: "CUSTOMERS/SET_CUSTOMER",
      payload: { id: "account-1", username: "customer@example.test" },
    });
  });
});
