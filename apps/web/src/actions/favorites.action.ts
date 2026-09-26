import axios from "axios";
import type { ApiResponse, FavoriteAnalysis } from "@bukit-delight/shared";
import type { AnyAction } from "redux";
import type { ThunkAction } from "redux-thunk";
import Const from "../constant/const";
import Actions from "./";
import type { RootState } from "../reducers";
import type { FavoriteMenuRecord } from "../reducers/favorites.reducer";
import type { MenuRecord } from "../reducers/menus.reducer";

export const MOUNT = "FAVORITES/MOUNT";
export const LOADING = "FAVORITES/LOADING";
export const SET_FAVORITES = "FAVORITES/SET_FAVORITES";

type FavoriteThunk = ThunkAction<void, RootState, unknown, AnyAction>;
type StoredAccount = { accessToken?: string; refreshToken?: string };
type FavoriteResponse = ApiResponse<FavoriteAnalysis>;

const readAccount = (): StoredAccount | null => {
  const storedAccount = localStorage.getItem("account");
  return storedAccount ? (JSON.parse(storedAccount) as StoredAccount) : null;
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

const isFavoriteAnalysis = (value: unknown): value is FavoriteAnalysis =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const mount = () => ({ type: MOUNT });
const loading = (isLoading: boolean) => ({ type: LOADING, payload: isLoading });
const setFavorites = (favorites: FavoriteAnalysis) => ({
  type: SET_FAVORITES,
  payload: favorites,
});

const onLoadSelectors = (): FavoriteThunk => {
  return (dispatch, getState) => {
    const { Menus, Favorites } = getState();
    const favoriteData = Favorites.data;
    if (Array.isArray(favoriteData) || !favoriteData.menu_favorit) return;

    const favoriteIds = new Set(
      favoriteData.menu_favorit.map(({ _id }: FavoriteMenuRecord) => _id),
    );
    const menus = Menus.data.map((menu): MenuRecord => ({
      ...menu,
      favorite: menu._id ? favoriteIds.has(menu._id) : false,
    }));

    dispatch(Actions.Menus.setMenus(menus));
    setTimeout(() => dispatch(mount()), 1000);
  };
};

const loadFavorites = (isInitialLoad: boolean): FavoriteThunk => {
  const URL_PATH = "api/v1/machine/favorite";
  return (dispatch) => {
    if (!isInitialLoad) dispatch(loading(true));

    axios({
      method: "GET",
      url: URL_PATH,
      baseURL: Const.BASE_URL,
      headers: requestHeaders(),
    })
      .then((response) => {
        const body = response.data as FavoriteResponse;
        if (body.name && `${body.name}`.toLowerCase() === "success") {
          if (!isFavoriteAnalysis(body.data)) {
            dispatch(Actions.Service.pushErrorNotification("error"));
            if (!isInitialLoad) dispatch(loading(false));
            return;
          }
          dispatch(setFavorites(body.data));
          if (isInitialLoad) {
            setTimeout(() => dispatch(onLoadSelectors()), 1000);
          }
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

const onMount = (): FavoriteThunk => loadFavorites(true);
const onLoad = (): FavoriteThunk => loadFavorites(false);

const FavoritesAction = { onMount, onLoad };

export default FavoritesAction;
