import axios from "axios";
import Const from "./../constant/const";
import Actions from "./";

export const MOUNT = "FAVORITES/MOUNT";
export const LOADING = "FAVORITES/LOADING";
export const SET_FAVORITES = "FAVORITES/SET_FAVORITES";

const localGetAccount = async () => {
  const account = await JSON.parse(localStorage.getItem("account"));
  return account;
};

const mount = () => {
  return {
    type: MOUNT,
  };
};

const onMount = () => {
  const URL_PATH = `api/v1/machine/favorite`;
  return async (dispatch) => {
    const account = await localGetAccount();
    const HEADERS = {
      "x-api-key": Const.X_API_KEY,
      "x-app-key": Const.X_APP_KEY,
      "x-access-token": account ? account.accessToken : "",
      "x-refresh-token": account ? account.refreshToken : "",
    };

    axios({
      method: "GET",
      url: URL_PATH,
      baseURL: Const.BASE_URL,
      headers: HEADERS,
    })
      .then((res) => {
        if (res["data"]["name"]) {
          const name = `${res["data"]["name"]}`.toLowerCase();
          if (name === "success") {
            const favorites = res["data"]["data"];
            dispatch(setFavorites(favorites));
            setTimeout(() => {
              dispatch(onLoadSelectors());
            }, 1000);
          } else {
            const err = res["data"]["message"];
            dispatch(Actions.Service.pushInfoNotification(err));
          }
        } else {
          dispatch(Actions.Service.pushErrorNotification("error"));
        }
      })
      .catch((err) => {
        dispatch(Actions.Service.pushErrorNotification(err.message));
      });
  };
};

const onLoadSelectors = () => {
  return async (dispatch, getState) => {
    const state = await getState();
    const Menus = state.Menus;
    const Favorites = state.Favorites;
    if (Menus && Favorites.data && Favorites.data.menu_favorit) {
      const new_Menus = await Menus.data.map((e) => {
        const favorite = Favorites.data.menu_favorit.find(
          (x) => x._id.toString() === e._id.toString()
        );
        if (favorite) {
          e["favorite"] = true;
          return e;
        } else {
          e["favorite"] = false;
          return e;
        }
      });

      await dispatch(Actions.Menus.setMenus(new_Menus));
      setTimeout(() => {
        dispatch(mount());
      }, 1000);
    }
  };
};

const onLoad = () => {
  const URL_PATH = `api/v1/machine/favorite`;
  return async (dispatch) => {
    dispatch(loading(true));

    const account = await localGetAccount();
    const HEADERS = {
      "x-api-key": Const.X_API_KEY,
      "x-app-key": Const.X_APP_KEY,
      "x-access-token": account ? account.accessToken : "",
      "x-refresh-token": account ? account.refreshToken : "",
    };

    axios({
      method: "GET",
      url: URL_PATH,
      baseURL: Const.BASE_URL,
      headers: HEADERS,
    })
      .then((res) => {
        if (res["data"]["name"]) {
          const name = `${res["data"]["name"]}`.toLowerCase();
          if (name === "success") {
            const favorites = res["data"]["data"];
            dispatch(setFavorites(favorites));
          } else {
            const err = res["data"]["message"];
            dispatch(Actions.Service.pushInfoNotification(err));
            dispatch(loading(false));
          }
        } else {
          dispatch(Actions.Service.pushErrorNotification("error"));
          dispatch(loading(false));
        }
      })
      .catch((err) => {
        dispatch(Actions.Service.pushErrorNotification(err.message));
        dispatch(loading(false));
      });
  };
};

const setFavorites = (favorites) => {
  return {
    type: SET_FAVORITES,
    payload: favorites,
  };
};

const loading = (bool) => {
  return {
    type: LOADING,
    payload: bool,
  };
};

const FavoritesAction = {
  onMount,
  onLoad,
};

export default FavoritesAction;
