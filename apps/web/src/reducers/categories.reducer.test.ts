import { describe, expect, it } from "vitest";
import CategoriesReducer from "./categories.reducer";
import { LOADING, MOUNT, SET_CATEGORIES } from "../actions/categories.action";

describe("CategoriesReducer", () => {
  it("starts with empty, idle category state", () => {
    expect(CategoriesReducer(undefined, { type: "@@init" })).toEqual({
      mount: false,
      loading: false,
      data: [],
    });
  });

  it("tracks mount and loading transitions", () => {
    const mounted = CategoriesReducer(undefined, { type: MOUNT });
    expect(mounted.mount).toBe(true);
    expect(
      CategoriesReducer(mounted, { type: LOADING, payload: true }),
    ).toEqual({ ...mounted, loading: true });
  });

  it("stores loaded categories and clears loading", () => {
    const categories = [{ id: "category-1", name: "Coffee" }];
    expect(
      CategoriesReducer(
        { mount: true, loading: true, data: [] },
        { type: SET_CATEGORIES, payload: categories },
      ),
    ).toEqual({ mount: true, loading: false, data: categories });
  });
});
