import { describe, expect, it } from "vitest";
import { LOADING, MOUNT, SET_FAVORITES } from "../actions/favorites.action";
import FavoritesReducer from "./favorites.reducer";

describe("FavoritesReducer", () => {
  it("starts with no analysis data", () => {
    expect(FavoritesReducer(undefined, { type: "@@init" })).toEqual({
      mount: false,
      loading: false,
      data: [],
    });
  });

  it("tracks mount and loading transitions", () => {
    const mounted = FavoritesReducer(undefined, { type: MOUNT });
    expect(mounted.mount).toBe(true);
    expect(FavoritesReducer(mounted, { type: LOADING, payload: true })).toEqual(
      { ...mounted, loading: true },
    );
  });

  it("stores favorite analysis and clears loading", () => {
    const analysis = {
      menu_favorit: [{ _id: "menu-1", name: "Latte" }],
      DataSet: [{ name_menu: "Latte", x: 1, y: 2 }],
      c_awal: [],
      data_kmeans: [],
      menu_cluster_akhir: { c1: [], c2: [], c3: [] },
    };
    expect(
      FavoritesReducer(
        { mount: true, loading: true, data: [] },
        { type: SET_FAVORITES, payload: analysis },
      ),
    ).toEqual({ mount: true, loading: false, data: analysis });
  });
});
