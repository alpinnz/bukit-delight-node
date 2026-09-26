import type { AnyAction } from "redux";
import type { MenuRecord } from "@bukit-delight/shared";
import { LOADING, MOUNT, SET_MENUS } from "../actions/menus.action";

export type { MenuRecord } from "@bukit-delight/shared";

type ApiMenuRecord = {
  id_category: { _id: string; name: string };
  [key: string]: unknown;
};

export type MenusState = {
  mount: boolean;
  loading: boolean;
  data: MenuRecord[];
};

const initialState: MenusState = {
  mount: false,
  loading: false,
  data: [],
};

const MenusReducer = (
  state: MenusState = initialState,
  action: AnyAction,
): MenusState => {
  if (action.type === MOUNT) return { ...state, mount: true };
  if (action.type === LOADING) {
    return { ...state, loading: action.payload as boolean };
  }
  if (action.type === SET_MENUS) {
    const menus = action.payload as ApiMenuRecord[];
    return {
      ...state,
      loading: false,
      data: menus.map((menu): MenuRecord => ({
        ...menu,
        category_id: menu.id_category._id,
        category_name: menu.id_category.name,
      })),
    };
  }
  return state;
};

export default MenusReducer;
