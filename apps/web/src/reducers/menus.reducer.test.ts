import { describe, expect, it } from "vitest";
import { LOADING, MOUNT, SET_MENUS } from "../actions/menus.action";
import MenusReducer from "./menus.reducer";

describe("MenusReducer", () => {
  it("starts with an empty, idle menu state", () => {
    expect(MenusReducer(undefined, { type: "@@init" })).toEqual({
      mount: false,
      loading: false,
      data: [],
    });
  });

  it("tracks mount and loading transitions", () => {
    const mounted = MenusReducer(undefined, { type: MOUNT });
    expect(mounted.mount).toBe(true);
    expect(MenusReducer(mounted, { type: LOADING, payload: true })).toEqual({
      ...mounted,
      loading: true,
    });
  });

  it("adds category fields without mutating API menu records", () => {
    const menu = {
      id: "menu-1",
      name: "Latte",
      category_id: { id: "category-1", name: "Coffee" },
    };
    const loaded = MenusReducer(
      { mount: true, loading: true, data: [] },
      { type: SET_MENUS, payload: [menu] },
    );

    expect(loaded).toEqual({
      mount: true,
      loading: false,
      data: [
        {
          ...menu,
          category_id: "category-1",
          category_name: "Coffee",
        },
      ],
    });
    expect(menu).not.toHaveProperty("category_id");
    expect(menu).not.toHaveProperty("category_name");
  });
});
