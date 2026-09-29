import type { AnyAction } from "redux";
import type { UserRecord } from "@bukit-delight/shared";
import { LOADING, MOUNT, SET_USERS } from "../actions/users.action";

export type { UserRecord } from "@bukit-delight/shared";
type UserView = UserRecord & {
  password: string;
  role_names?: string;
};

export type UsersState = {
  mount: boolean;
  loading: boolean;
  data: UserView[];
};

const initialState: UsersState = {
  mount: false,
  loading: false,
  data: [],
};

const UsersReducer = (
  state: UsersState = initialState,
  action: AnyAction,
): UsersState => {
  if (action.type === MOUNT) return { ...state, mount: true };
  if (action.type === LOADING) {
    return { ...state, loading: action.payload as boolean };
  }
  if (action.type === SET_USERS) {
    const users = action.payload as UserRecord[];
    return {
      ...state,
      loading: false,
      data: users.map((user) => ({
        ...user,
        ...(user.id_roles
          ? {
              role_names: user.id_roles.map((role) => role.name).join(", "),
            }
          : {}),
        password: "******",
      })),
    };
  }
  return state;
};

export default UsersReducer;
