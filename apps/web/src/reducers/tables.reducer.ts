import type { AnyAction } from "redux";
import type { TableRecord } from "@bukit-delight/shared";
import {
  MOUNT,
  LOADING,
  SET_TABLES,
  SET_TABLE,
  CLEAN_TABLE,
} from "./../actions/tables.action";

export type { TableRecord } from "@bukit-delight/shared";

export type TablesState = {
  mount: boolean;
  loading: boolean;
  data: TableRecord[];
  table: TableRecord | null;
};

const initialState: TablesState = {
  mount: false,
  loading: false,
  data: [],
  table: null,
};

const TablesReducer = (
  state: TablesState = initialState,
  action: AnyAction,
): TablesState => {
  if (action.type === MOUNT) {
    return { ...state, mount: true };
  }
  if (action.type === LOADING) {
    return { ...state, loading: action.payload };
  }
  if (action.type === SET_TABLES) {
    return {
      ...state,
      loading: false,
      data: action.payload as TableRecord[],
    };
  }

  if (action.type === SET_TABLE) {
    return {
      ...state,
      loading: false,
      table: action.payload as TableRecord,
    };
  }
  if (action.type === CLEAN_TABLE) {
    return {
      ...state,
      loading: false,
      table: null,
    };
  }

  return state;
};
export default TablesReducer;
