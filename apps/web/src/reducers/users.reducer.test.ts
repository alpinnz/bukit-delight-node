import { describe, expect, it } from "vitest";
import { LOADING, MOUNT, SET_USERS } from "../actions/users.action";
import UsersReducer from "./users.reducer";

describe("UsersReducer", () => {
  it("starts with an empty, idle account state", () => {
    expect(UsersReducer(undefined, { type: "@@init" })).toEqual({
      mount: false,
      loading: false,
      data: [],
    });
  });

  it("tracks mount and loading transitions", () => {
    const mounted = UsersReducer(undefined, { type: MOUNT });
    expect(mounted.mount).toBe(true);
    expect(UsersReducer(mounted, { type: LOADING, payload: true })).toEqual({
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
      id_roles: [
        { _id: "role-1", name: "cashier" },
        { _id: "role-2", name: "customer" },
      ],
    };
    const loaded = UsersReducer(
      { mount: true, loading: true, data: [] },
      { type: SET_USERS, payload: [account] },
    );

    expect(loaded.data).toEqual([
      {
        ...account,
        role_names: "cashier, customer",
        password: "******",
      },
    ]);
    expect(account.password).toBe("hash-from-api");
    expect(account).not.toHaveProperty("role_names");
  });
});
