import axios from "axios";
import type {
  ApiResponse,
  CategoryRecord,
  CreateCategoryRequest,
} from "@bukit-delight/shared";
import type { AnyAction } from "redux";
import type { ThunkAction } from "redux-thunk";
import Const from "../constant/const";
import Actions from "./";
import type { RootState } from "../reducers";

export const MOUNT = "CATEGORIES/MOUNT";
export const LOADING = "CATEGORIES/LOADING";
export const SET_CATEGORIES = "CATEGORIES/SET_CATEGORIES";

type CategoryThunk = ThunkAction<void, RootState, unknown, AnyAction>;
type StoredAccount = { accessToken: string; refreshToken: string };
type CategoriesResponse = ApiResponse<CategoryRecord[]>;
type CategoryForm = Partial<CreateCategoryRequest> & { image?: File };

const localGetAccount = (): StoredAccount | null => {
  const serializedAccount = localStorage.getItem("account");
  return serializedAccount
    ? (JSON.parse(serializedAccount) as StoredAccount)
    : null;
};

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

const responseBody = (response: { data: unknown }): CategoriesResponse =>
  response.data as CategoriesResponse;

const mount = () => ({ type: MOUNT });
const loading = (isLoading: boolean) => ({ type: LOADING, payload: isLoading });

const loadCategories = (isInitialLoad: boolean): CategoryThunk => {
  const URL_PATH = "api/v1/categories";
  return (dispatch) => {
    if (!isInitialLoad) dispatch(loading(true));
    axios({
      method: "GET",
      url: URL_PATH,
      baseURL: Const.BASE_URL,
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
          dispatch(setCategories(body.data));
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

const onMount = (): CategoryThunk => loadCategories(true);
const onLoad = (): CategoryThunk => loadCategories(false);

const saveCategory = (
  method: "POST" | "PUT",
  url: string,
  input: CategoryForm,
  successMessage: string,
): CategoryThunk => {
  return (dispatch) => {
    dispatch(loading(true));
    const formData = new FormData();
    formData.append("name", input.name ?? "");
    formData.append("desc", input.desc ?? "");
    if (input.image) formData.append("image", input.image);

    axios({
      method,
      url,
      baseURL: Const.BASE_URL,
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

const onCreate = (input: CategoryForm): CategoryThunk =>
  saveCategory("POST", "api/v1/categories/", input, "Create Categories");

const onUpdate = (id: string | undefined, input: CategoryForm): CategoryThunk =>
  saveCategory("PUT", `api/v1/categories/${id}`, input, "Update Categories");

const onDelete = (id: string): CategoryThunk => {
  return (dispatch) => {
    dispatch(loading(true));
    axios({
      method: "DELETE",
      url: `api/v1/categories/${id}`,
      baseURL: Const.BASE_URL,
      headers: requestHeaders(localGetAccount()),
    })
      .then((response) => {
        const body = responseBody(response);
        if (body.name && `${body.name}`.toLowerCase() === "success") {
          dispatch(onLoad());
          dispatch(
            Actions.Service.pushSuccessNotification("Delete Categories"),
          );
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

const setCategories = (categories: CategoryRecord[]) => ({
  type: SET_CATEGORIES,
  payload: categories,
});

const CategoriesAction = { onMount, onLoad, onCreate, onUpdate, onDelete };

export default CategoriesAction;
