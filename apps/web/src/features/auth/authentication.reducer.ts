import type { AnyAction } from "redux";
import {
  MOUNT,
  LOADING,
  REMOVE_ACCOUNT,
  SET_ACCOUNT,
} from "./authentication.action";

const initialState = {
  mount: false,
  loading: false,
  account: null,
};

export type AuthenticationAccount = {
  _id: string;
  username: string;
  email: string;
  role: string;
  roles?: string[];
  accessToken: string;
  refreshToken: string;
};

export type AuthenticationState = {
  mount: boolean;
  loading: boolean;
  account: AuthenticationAccount | null;
};

const initialAuthenticationState: AuthenticationState = initialState;

const AuthenticationReducer = (
  state: AuthenticationState = initialAuthenticationState,
  action: AnyAction,
): AuthenticationState => {
  if (action.type === MOUNT) {
    return { ...state, mount: true };
  }
  if (action.type === LOADING) {
    return { ...state, loading: action.payload };
  }
  if (action.type === SET_ACCOUNT) {
    return {
      ...state,

      loading: false,
      account: action.payload as AuthenticationAccount,
    };
  }

  if (action.type === REMOVE_ACCOUNT) {
    return {
      ...state,
      loading: false,
      account: null,
    };
  }

  return state;
};
export default AuthenticationReducer;
