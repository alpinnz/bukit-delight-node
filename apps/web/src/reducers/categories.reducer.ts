import type { AnyAction } from "redux";
import type { CategoryRecord } from "@bukit-delight/shared";
import { LOADING, MOUNT, SET_CATEGORIES } from "../actions/categories.action";

export type { CategoryRecord } from "@bukit-delight/shared";
export type CategoriesState = {
  mount: boolean;
  loading: boolean;
  data: CategoryRecord[];
};

const initialState: CategoriesState = {
  mount: false,
  loading: false,
  data: [],
};

const CategoriesReducer = (
  state: CategoriesState = initialState,
  action: AnyAction,
): CategoriesState => {
  if (action.type === MOUNT) return { ...state, mount: true };
  if (action.type === LOADING) {
    return { ...state, loading: action.payload as boolean };
  }
  if (action.type === SET_CATEGORIES) {
    return {
      ...state,
      loading: false,
      data: action.payload as CategoryRecord[],
    };
  }
  return state;
};

export default CategoriesReducer;
