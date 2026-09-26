import axios from "axios";
import type { ApiResponse, RoleRecord } from "@bukit-delight/shared";
import type { AnyAction } from "redux";
import type { ThunkAction } from "redux-thunk";
import Const from "../constant/const";
import Actions from "./";

export const MOUNT = "ROLES/MOUNT";
export const LOADING = "ROLES/LOADING";
export const SET_ROLES = "ROLESLSET_ROLES";

type RoleThunk = ThunkAction<void, unknown, unknown, AnyAction>;
type StoredAccount = { accessToken: string; refreshToken: string };
type RolesResponse = ApiResponse<RoleRecord[]>;

const localGetAccount = (): StoredAccount | null => {
  const serializedAccount = localStorage.getItem("account");
  return serializedAccount
    ? (JSON.parse(serializedAccount) as StoredAccount)
    : null;
};

const mount = () => ({ type: MOUNT });

const requestHeaders = (account: StoredAccount | null) => ({
  "x-api-key": Const.X_API_KEY,
  "x-app-key": Const.X_APP_KEY,
  "x-access-token": account?.accessToken ?? "",
  "x-refresh-token": account?.refreshToken ?? "",
});

const errorMessage = (cause: unknown): string => {
  if (
    typeof cause === "object" &&
    cause !== null &&
    "message" in cause &&
    typeof cause.message === "string"
  ) {
    return cause.message;
  }
  return "error";
};

const onMount = (): RoleThunk => {
  const URL_PATH = "api/v1/roles";
  return async (dispatch) => {
    const account = localGetAccount();
    axios({
      method: "GET",
      url: URL_PATH,
      baseURL: Const.BASE_URL,
      headers: requestHeaders(account),
    })
      .then((response) => {
        const body = response.data as RolesResponse;
        if (body.name && `${body.name}`.toLowerCase() === "success") {
          if (!body.data) {
            dispatch(Actions.Service.pushErrorNotification("error"));
            return;
          }
          dispatch(setRoles(body.data));
          setTimeout(() => dispatch(mount()), 1000);
          return;
        }

        if (body.name) {
          dispatch(
            Actions.Service.pushInfoNotification(body.message ?? "error"),
          );
        } else {
          dispatch(Actions.Service.pushErrorNotification("error"));
        }
      })
      .catch((cause: unknown) => {
        dispatch(Actions.Service.pushErrorNotification(errorMessage(cause)));
      });
  };
};

const onLoad = (): RoleThunk => {
  const URL_PATH = "api/v1/roles/";
  return async (dispatch) => {
    dispatch(loading(true));

    const account = localGetAccount();
    axios({
      method: "GET",
      url: URL_PATH,
      baseURL: Const.BASE_URL,
      headers: requestHeaders(account),
    })
      .then((response) => {
        const body = response.data as RolesResponse;
        if (body.name && `${body.name}`.toLowerCase() === "success") {
          if (!body.data) {
            dispatch(Actions.Service.pushErrorNotification("error"));
            dispatch(loading(false));
            return;
          }
          dispatch(setRoles(body.data));
          return;
        }

        if (body.name) {
          dispatch(
            Actions.Service.pushInfoNotification(body.message ?? "error"),
          );
        } else {
          dispatch(Actions.Service.pushErrorNotification("error"));
        }
        dispatch(loading(false));
      })
      .catch((cause: unknown) => {
        dispatch(Actions.Service.pushErrorNotification(errorMessage(cause)));
        dispatch(loading(false));
      });
  };
};

const setRoles = (roles: RoleRecord[]) => ({
  type: SET_ROLES,
  payload: roles,
});

const loading = (isLoading: boolean) => ({ type: LOADING, payload: isLoading });

const RolesAction = { onMount, onLoad };

export default RolesAction;
