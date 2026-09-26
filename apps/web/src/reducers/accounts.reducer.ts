import type { AnyAction } from "redux";
import type { AccountRecord } from "@bukit-delight/shared";
import { LOADING, MOUNT, SET_ACCOUNTS } from "../actions/accounts.action";

export type { AccountRecord } from "@bukit-delight/shared";
type AccountView = AccountRecord & {
  password: string;
  role_id?: string;
  role_name?: string;
};

export type AccountsState = {
  mount: boolean;
  loading: boolean;
  data: AccountView[];
};

const initialState: AccountsState = {
  mount: false,
  loading: false,
  data: [],
};

const AccountsReducer = (
  state: AccountsState = initialState,
  action: AnyAction,
): AccountsState => {
  if (action.type === MOUNT) return { ...state, mount: true };
  if (action.type === LOADING) {
    return { ...state, loading: action.payload as boolean };
  }
  if (action.type === SET_ACCOUNTS) {
    const accounts = action.payload as AccountRecord[];
    return {
      ...state,
      loading: false,
      data: accounts.map((account) => ({
        ...account,
        ...(account.id_role
          ? {
              role_id: account.id_role._id,
              role_name: account.id_role.name,
            }
          : {}),
        password: "******",
      })),
    };
  }
  return state;
};

export default AccountsReducer;
