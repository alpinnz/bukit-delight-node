import { describe, expect, it } from "vitest";
import { LOADING, MOUNT, SET_ROLES } from "../actions/roles.action";
import RolesReducer from "./roles.reducer";

describe("RolesReducer", () => {
  it("tracks initialization, loading, and role data", () => {
    const initialState = RolesReducer(undefined, { type: "init" });
    expect(initialState).toEqual({ mount: false, loading: false, data: [] });

    const mountedState = RolesReducer(initialState, { type: MOUNT });
    const loadingState = RolesReducer(mountedState, {
      type: LOADING,
      payload: true,
    });
    const roles = [
      { _id: "role-admin", name: "admin" },
      { _id: "role-cashier", name: "cashier" },
    ];
    const loadedState = RolesReducer(loadingState, {
      type: SET_ROLES,
      payload: roles,
    });

    expect(loadedState).toEqual({ mount: true, loading: false, data: roles });
  });
});
