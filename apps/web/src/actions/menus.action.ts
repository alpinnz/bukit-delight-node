import axios from "axios";
import type { ApiResponse, CreateMenuRequest } from "@bukit-delight/shared";
import type { AnyAction } from "redux";
import type { ThunkAction } from "redux-thunk";
import Const from "../constant/const";
import Actions from "./";
import type { RootState } from "../reducers";
import type { FavoriteAnalysis } from "../reducers/favorites.reducer";
import type { MenuRecord } from "@bukit-delight/shared";

export const MOUNT = "MENUS/MOUNT";
export const LOADING = "MENUS/LOADING";
export const SET_MENUS = "MENUS/SET_MENUS";

type MenuThunk = ThunkAction<void, RootState, unknown, AnyAction>;
type StoredAccount = { accessToken?: string; refreshToken?: string };
type MenuForm = Partial<CreateMenuRequest> & { image?: File };
type MenuListResponse = ApiResponse<MenuRecord[]>;

const readAccount = (): StoredAccount | null => {
  const serializedAccount = localStorage.getItem("account");
  return serializedAccount
    ? (JSON.parse(serializedAccount) as StoredAccount)
    : null;
};

const requestHeaders = () => {
  const account = readAccount();
  return {
    "x-api-key": Const.X_API_KEY,
    "x-app-key": Const.X_APP_KEY,
    "x-access-token": account?.accessToken ?? "",
    "x-refresh-token": account?.refreshToken ?? "",
  };
};

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

const responseBody = <T>(response: { data: unknown }): ApiResponse<T> =>
  response.data as ApiResponse<T>;

const isMenuList = (value: unknown): value is MenuRecord[] =>
  Array.isArray(value);

const mount = () => ({ type: MOUNT });
const loading = (isLoading: boolean) => ({ type: LOADING, payload: isLoading });
const setMenus = (menus: MenuRecord[]) => ({
  type: SET_MENUS,
  payload: menus,
});

const onLoadSelectors = (): MenuThunk => {
  return (dispatch, getState) => {
    const { Menus, Cart, Favorites } = getState();
    const selectedMenuId = Cart.selected.menu._id;
    if (typeof selectedMenuId === "string") {
      const selectedMenu = Menus.data.find(({ _id }) => _id === selectedMenuId);
      if (selectedMenu) {
        dispatch(
          Cart.selected.id_cart
            ? Actions.Cart.selectedEdit(
                selectedMenu,
                Cart.selected.id_cart,
                Cart.selected.quality,
                Cart.selected.note,
              )
            : Actions.Cart.selectedAdd(selectedMenu),
        );
      }
    }

    const favoriteData = Favorites.data as FavoriteAnalysis | [];
    if (!Array.isArray(favoriteData) && favoriteData.menu_favorit) {
      const favoriteIds = new Set(
        favoriteData.menu_favorit.map(({ _id }) => _id),
      );
      const menus = Menus.data.map((menu) => ({
        ...menu,
        favorite: menu._id ? favoriteIds.has(menu._id) : false,
      }));
      dispatch(setMenus(menus));
    }

    setTimeout(() => dispatch(mount()), 1000);
  };
};

const loadMenus = (isInitialLoad: boolean): MenuThunk => {
  const URL_PATH = "api/v1/menus";
  return (dispatch) => {
    if (!isInitialLoad) dispatch(loading(true));
    axios({
      method: "GET",
      url: URL_PATH,
      baseURL: Const.BASE_URL,
      headers: requestHeaders(),
    })
      .then((response) => {
        const body = responseBody<MenuRecord[]>(response) as MenuListResponse;
        if (body.name && `${body.name}`.toLowerCase() === "success") {
          if (!isMenuList(body.data)) {
            dispatch(Actions.Service.pushErrorNotification("error"));
            if (!isInitialLoad) dispatch(loading(false));
            return;
          }
          dispatch(setMenus(body.data));
          setTimeout(() => dispatch(onLoadSelectors()), 1000);
          return;
        }

        if (body.name) {
          dispatch(
            Actions.Service.pushInfoNotification(body.message ?? "error"),
          );
        } else {
          dispatch(Actions.Service.pushErrorNotification("error"));
        }
        if (!isInitialLoad) dispatch(loading(false));
      })
      .catch((cause: unknown) => {
        dispatch(Actions.Service.pushErrorNotification(errorMessage(cause)));
        if (!isInitialLoad) dispatch(loading(false));
      });
  };
};

const onMount = (): MenuThunk => loadMenus(true);
const onLoad = (): MenuThunk => loadMenus(false);

const appendFormValue = (
  formData: FormData,
  field: string,
  value: string | number | boolean | undefined,
): void => {
  formData.append(field, String(value));
};

const menuFormData = (form: MenuForm, includeImage: boolean): FormData => {
  const formData = new FormData();
  appendFormValue(formData, "name", form.name);
  appendFormValue(formData, "desc", form.desc);
  if (includeImage) {
    if (form.image) formData.append("image", form.image);
    else formData.append("image", String(form.image));
  }
  appendFormValue(formData, "price", form.price);
  if (includeImage) {
    appendFormValue(formData, "duration", form.duration);
    if (form.promo) appendFormValue(formData, "promo", form.promo);
  } else {
    appendFormValue(formData, "promo", form.promo);
    appendFormValue(formData, "duration", form.duration);
    if (form.image) formData.append("image", form.image);
  }
  appendFormValue(formData, "id_category", form.id_category);
  appendFormValue(formData, "isAvailable", Boolean(form.isAvailable));
  appendFormValue(formData, "isFavorite", Boolean(form.isFavorite));
  return formData;
};

const saveMenu = (
  method: "POST" | "PUT",
  url: string,
  form: MenuForm,
  isCreate: boolean,
): MenuThunk => {
  return (dispatch) => {
    dispatch(loading(true));
    axios({
      method,
      url,
      baseURL: Const.BASE_URL,
      data: menuFormData(form, isCreate),
      headers: requestHeaders(),
    })
      .then((response) => {
        const body = responseBody(response);
        if (body.name && `${body.name}`.toLowerCase() === "success") {
          dispatch(onLoad());
          dispatch(
            Actions.Service.pushSuccessNotification(
              isCreate ? "Create Menus" : "Update Menus",
            ),
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

const onCreate = (form: MenuForm): MenuThunk =>
  saveMenu("POST", "api/v1/menus", form, true);

const onUpdate = (id: string | undefined, form: MenuForm): MenuThunk =>
  saveMenu("PUT", `api/v1/menus/${id}`, form, false);

const onDelete = (id: string): MenuThunk => {
  const URL_PATH = `api/v1/menus/${id}`;
  return (dispatch) => {
    dispatch(loading(true));
    axios({
      method: "DELETE",
      url: URL_PATH,
      baseURL: Const.BASE_URL,
      headers: requestHeaders(),
    })
      .then((response) => {
        const body = responseBody(response);
        if (body.name && `${body.name}`.toLowerCase() === "success") {
          dispatch(onLoad());
          dispatch(Actions.Service.pushSuccessNotification("Delete Menus"));
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

const MenuAction = {
  onMount,
  onLoad,
  onCreate,
  onUpdate,
  onDelete,
  setMenus,
};

export default MenuAction;
