import { describe, expect, it } from "vitest";
import { LOADING, MOUNT, SET_ACCOUNTS } from "../actions/accounts.action";
import AccountsReducer from "./accounts.reducer";

describe("AccountsReducer", () => {
  it("starts with an empty, idle account state", () => {
    expect(AccountsReducer(undefined, { type: "@@init" })).toEqual({
      mount: false,
      loading: false,
      data: [],
    });
  });

  it("tracks mount and loading transitions", () => {
    const mounted = AccountsReducer(undefined, { type: MOUNT });
    expect(mounted.mount).toBe(true);
    expect(AccountsReducer(mounted, { type: LOADING, payload: true })).toEqual({
      ...mounted,
      loading: true,
    });
  });

  it("masks passwords and maps populated role fields without mutating input", () => {
    const account = {
      _id: "account-1",
      username: "staff",
      email: "staff@example.test",
      password: "hash-from-api",
      id_role: { _id: "role-1", name: "cashier" },
    };
    const loaded = AccountsReducer(
      { mount: true, loading: true, data: [] },
      { type: SET_ACCOUNTS, payload: [account] },
    );

    expect(loaded.data).toEqual([
      {
        ...account,
        role_id: "role-1",
        role_name: "cashier",
        password: "******",
      },
    ]);
    expect(account.password).toBe("hash-from-api");
    expect(account).not.toHaveProperty("role_id");
  });
});
