import axios from "axios";
import type {
  ApiResponse,
  UserRecord,
  CreateUserRequest,
  UpdateUserRequest,
} from "@bukit-delight/shared";
import type { AnyAction } from "redux";
import type { ThunkAction } from "redux-thunk";
import apiConfig from "../config/api-config";
import Actions from "./";
import type { RootState } from "../reducers";

export const MOUNT = "USERS/MOUNT";
export const LOADING = "USERS/LOADING";
export const SET_USERS = "USERS/SET_USERS";

type AccountThunk = ThunkAction<void, RootState, unknown, AnyAction>;
type StoredAccount = { access_token: string; refresh_token: string };
type UsersResponse = ApiResponse<UserRecord[]>;
type AccountForm =
  Partial<CreateUserRequest> | Partial<UpdateUserRequest>;

const localGetAccount = (): StoredAccount | null => {
  const serializedAccount = localStorage.getItem("account");
  return serializedAccount
    ? (JSON.parse(serializedAccount) as StoredAccount)
    : null;
};

const requestHeaders = (account: StoredAccount | null) => ({
  "x-api-key": apiConfig.apiKey,
  "x-app-key": apiConfig.appKey,
  "x-access-token": account?.access_token ?? "",
  "x-refresh-token": account?.refresh_token ?? "",
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

const responseBody = (response: { data: unknown }): UsersResponse =>
  response.data as UsersResponse;

const mount = () => ({ type: MOUNT });
const loading = (isLoading: boolean) => ({ type: LOADING, payload: isLoading });

const loadUsers = (isInitialLoad: boolean): AccountThunk => {
  const URL_PATH = "api/v1/users";
  return (dispatch) => {
    if (!isInitialLoad) dispatch(loading(true));
    axios({
      method: "GET",
      url: URL_PATH,
      baseURL: apiConfig.baseUrl,
      headers: requestHeaders(localGetAccount()),
    })
      .then((response) => {
        const body = responseBody(response);
        if (body.name && `${body.name}`.toLowerCase() === "success") {
          if (!body.data) {
            dispatch(Actions.Service.pushErrorNotification("error"));
            dispatch(loading(false));
            return;
          }
          dispatch(setUsers(body.data));
          if (isInitialLoad) setTimeout(() => dispatch(mount()), 1000);
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

const onMount = (): AccountThunk => loadUsers(true);
const onLoad = (): AccountThunk => loadUsers(false);

const submitAccount = (
  method: "POST" | "PUT",
  url: string,
  input: AccountForm,
  successMessage: string,
): AccountThunk => {
  return (dispatch) => {
    dispatch(loading(true));
    const formData = new FormData();
    formData.append("username", input.username ?? "");
    formData.append("email", input.email ?? "");
    formData.append("role_ids", input.role_ids?.join(",") ?? "");
    if (method === "POST" || (input.password && input.repeat_password)) {
      formData.append("password", input.password ?? "");
      formData.append("repeat_password", input.repeat_password ?? "");
    }

    axios({
      method,
      url,
      baseURL: apiConfig.baseUrl,
      data: formData,
      headers: requestHeaders(localGetAccount()),
    })
      .then((response) => {
        const body = responseBody(response);
        if (body.name && `${body.name}`.toLowerCase() === "success") {
          dispatch(onLoad());
          dispatch(Actions.Service.pushSuccessNotification(successMessage));
          dispatch(Actions.Service.hideFormDialog());
          dispatch(loading(false));
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

const onCreate = (input: Partial<CreateUserRequest>): AccountThunk =>
  submitAccount("POST", "api/v1/users", input, "Create User");

const onUpdate = (
  id: string | undefined,
  input: Partial<UpdateUserRequest>,
): AccountThunk =>
  submitAccount("PUT", `api/v1/users/${id}`, input, "Update User");

const onDelete = (id: string): AccountThunk => {
  return (dispatch) => {
    dispatch(loading(true));
    axios({
      method: "DELETE",
      url: `api/v1/users/${id}`,
      baseURL: apiConfig.baseUrl,
      headers: requestHeaders(localGetAccount()),
    })
      .then((response) => {
        const body = responseBody(response);
        if (body.name && `${body.name}`.toLowerCase() === "success") {
          dispatch(onLoad());
          dispatch(Actions.Service.pushSuccessNotification("Delete User"));
          dispatch(Actions.Service.hideFormDialog());
          dispatch(loading(false));
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

const setUsers = (users: UserRecord[]) => ({
  type: SET_USERS,
  payload: users,
});

const UsersAction = { onMount, onLoad, onCreate, onUpdate, onDelete };

export default UsersAction;
