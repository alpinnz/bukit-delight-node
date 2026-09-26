import type { AnyAction } from "redux";
import type { RoleRecord } from "@bukit-delight/shared";
import { MOUNT, LOADING, SET_ROLES } from "./../actions/roles.action";

export type { RoleRecord } from "@bukit-delight/shared";

export type RolesState = {
  mount: boolean;
  loading: boolean;
  data: RoleRecord[];
};

const initialState: RolesState = {
  mount: false,
  loading: false,
  data: [],
};

const RolesReducer = (
  state: RolesState = initialState,
  action: AnyAction,
): RolesState => {
  if (action.type === MOUNT) {
    return { ...state, mount: true };
  }
  if (action.type === LOADING) {
    return { ...state, loading: action.payload };
  }
  if (action.type === SET_ROLES) {
    return {
      ...state,
      loading: false,
      data: action.payload as RoleRecord[],
    };
  }

  return state;
};
export default RolesReducer;
