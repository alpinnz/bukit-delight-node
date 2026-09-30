import { describe, expect, it } from "vitest";
import {
  CLEAN_TABLE,
  LOADING,
  MOUNT,
  SET_TABLE,
  SET_TABLES,
} from "../actions/tables.action";
import TablesReducer from "./tables.reducer";

describe("TablesReducer", () => {
  it("tracks initialization, table list, and selected table state", () => {
    const initialState = TablesReducer(undefined, { type: "init" });
    expect(initialState).toEqual({
      mount: false,
      loading: false,
      data: [],
      table: null,
    });

    const mountedState = TablesReducer(initialState, { type: MOUNT });
    const loadingState = TablesReducer(mountedState, {
      type: LOADING,
      payload: true,
    });
    const tables = [
      { id: "table-1", name: "A1" },
      { id: "table-2", name: "A2" },
    ];
    const listState = TablesReducer(loadingState, {
      type: SET_TABLES,
      payload: tables,
    });
    const selectedState = TablesReducer(listState, {
      type: SET_TABLE,
      payload: tables[0],
    });

    expect(selectedState).toEqual({
      mount: true,
      loading: false,
      data: tables,
      table: tables[0],
    });
    expect(
      TablesReducer(selectedState, { type: CLEAN_TABLE }).table,
    ).toBeNull();
  });
});
