import axios from "axios";
import Const from "./../constant/const";
import Actions from "./";

export const MOUNT = "MENUS/MOUNT";
export const LOADING = "MENUS/LOADING";
export const SET_MENUS = "MENUS/SET_MENUS";

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
  const URL_PATH = `api/v1/menus`;
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
            const menus = res["data"]["data"];
            dispatch(setMenus(menus));
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

const onLoad = () => {
  const URL_PATH = `api/v1/menus`;
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
            const menus = res["data"]["data"];
            dispatch(setMenus(menus));
            setTimeout(() => {
              dispatch(onLoadSelectors());
            }, 1000);
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

const onLoadSelectors = () => {
  return async (dispatch, getState) => {
    const state = await getState();
    const Menus = state.Menus;
    const Cart = state.Cart;
    const Favorites = state.Favorites;
    if (Cart.selected && Cart.selected.menu && Cart.selected.menu._id) {
      let _id = Cart.selected.menu._id;
      const menus = Menus.data.find((e) => e._id === _id);
      if (menus) {
        if (Cart.selected.id_cart) {
          await dispatch(Actions.Cart.selectedEdit(menus));
        } else {
          await dispatch(Actions.Cart.selectedAdd(menus));
        }
      }
    }

    if (Favorites.data && Favorites.data.menu_favorit) {
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
    }

    setTimeout(() => {
      dispatch(mount());
    }, 1000);
  };
};

const onCreate = (props) => {
  const {
    name,
    desc,
    image,
    price,
    id_category,
    duration,
    promo,
    isAvailable,
    isFavorite,
  } = props;
  const URL_PATH = `api/v1/menus`;

  return async (dispatch) => {
    dispatch(loading(true));

    const formData = new FormData();
    formData.append("name", name);
    formData.append("desc", desc);
    formData.append("image", image);
    formData.append("price", price);
    formData.append("duration", duration);
    if (promo) {
      formData.append("promo", promo);
    }

    formData.append("id_category", id_category);

    formData.append("isAvailable", isAvailable ? true : false);
    formData.append("isFavorite", isFavorite ? true : false);

    const account = await localGetAccount();
    const HEADERS = {
      "x-api-key": Const.X_API_KEY,
      "x-app-key": Const.X_APP_KEY,
      "x-access-token": account ? account.accessToken : "",
      "x-refresh-token": account ? account.refreshToken : "",
    };

    axios({
      method: "POST",
      url: URL_PATH,
      baseURL: Const.BASE_URL,
      data: formData,
      headers: HEADERS,
    })
      .then((res) => {
        if (res["data"]["name"]) {
          const name = `${res["data"]["name"]}`.toLowerCase();
          if (name === "success") {
            dispatch(onLoad());
            dispatch(Actions.Service.pushSuccessNotification("Create Menus"));
            dispatch(Actions.Service.hideFormDialog());
            dispatch(loading(false));
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

const onUpdate = (_id, props) => {
  const {
    name,
    desc,
    image,
    price,
    id_category,
    duration,
    promo,
    isAvailable,
    isFavorite,
  } = props;
  const URL_PATH = `api/v1/menus/${_id}`;
  return async (dispatch) => {
    dispatch(loading(true));

    const formData = new FormData();
    formData.append("name", name);
    formData.append("desc", desc);
    formData.append("price", price);
    formData.append("promo", promo);
    formData.append("duration", duration);
    if (image) {
      formData.append("image", image);
    }
    formData.append("id_category", id_category);

    formData.append("isAvailable", isAvailable ? true : false);
    formData.append("isFavorite", isFavorite ? true : false);

    const account = await localGetAccount();
    const HEADERS = {
      "x-api-key": Const.X_API_KEY,
      "x-app-key": Const.X_APP_KEY,
      "x-access-token": account ? account.accessToken : "",
      "x-refresh-token": account ? account.refreshToken : "",
    };

    axios({
      method: "PUT",
      url: URL_PATH,
      baseURL: Const.BASE_URL,
      data: formData,
      headers: HEADERS,
    })
      .then((res) => {
        if (res["data"]["name"]) {
          const name = `${res["data"]["name"]}`.toLowerCase();
          if (name === "success") {
            dispatch(onLoad());
            dispatch(Actions.Service.pushSuccessNotification("Update Menus"));
            dispatch(Actions.Service.hideFormDialog());
            dispatch(loading(false));
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

const onDelete = (_id) => {
  const URL_PATH = `api/v1/menus/${_id}`;
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
      method: "DELETE",
      url: URL_PATH,
      baseURL: Const.BASE_URL,
      headers: HEADERS,
    })
      .then((res) => {
        if (res["data"]["name"]) {
          const name = `${res["data"]["name"]}`.toLowerCase();
          if (name === "success") {
            dispatch(onLoad());
            dispatch(Actions.Service.pushSuccessNotification("Delete Menus"));
            dispatch(Actions.Service.hideFormDialog());
            dispatch(loading(false));
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

const setMenus = (menus) => {
  return {
    type: SET_MENUS,
    payload: menus,
  };
};

const loading = (bool) => {
  return {
    type: LOADING,
    payload: bool,
  };
};

const AccountsAction = {
  onMount,
  onLoad,
  onCreate,
  onUpdate,
  onDelete,
  setMenus,
};

export default AccountsAction;
