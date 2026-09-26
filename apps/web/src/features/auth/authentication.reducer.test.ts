import { describe, expect, it } from "vitest";
import {
  LOADING,
  MOUNT,
  REMOVE_ACCOUNT,
  SET_ACCOUNT,
} from "./authentication.action";
import AuthenticationReducer, {
  type AuthenticationAccount,
} from "./authentication.reducer";

describe("AuthenticationReducer", () => {
  it("tracks mount/loading and stores or removes the authenticated account", () => {
    const initialState = AuthenticationReducer(undefined, { type: "init" });
    expect(initialState).toEqual({
      mount: false,
      loading: false,
      account: null,
    });

    const mountedState = AuthenticationReducer(initialState, { type: MOUNT });
    const loadingState = AuthenticationReducer(mountedState, {
      type: LOADING,
      payload: true,
    });
    expect(loadingState).toMatchObject({ mount: true, loading: true });

    const account: AuthenticationAccount = {
      _id: "account-1",
      username: "cashier",
      email: "cashier@example.test",
      role: "cashier",
      accessToken: "access-token",
      refreshToken: "refresh-token",
    };
    const authenticatedState = AuthenticationReducer(loadingState, {
      type: SET_ACCOUNT,
      payload: account,
    });
    expect(authenticatedState).toMatchObject({
      mount: true,
      loading: false,
      account,
    });

    expect(
      AuthenticationReducer(authenticatedState, { type: REMOVE_ACCOUNT }),
    ).toMatchObject({ mount: true, loading: false, account: null });
  });
});
